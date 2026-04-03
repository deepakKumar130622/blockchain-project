import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Web3 from "web3";
import { uploadToPinata } from "../pinataUpload";
import NavBar_Logout from "./NavBar_Logout";

const DoctorForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient || {};

  const [doctorWallet, setDoctorWallet] = useState("Fetching...");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [recordId] = useState(`EHR${Math.random().toString(36).substring(2, 15)}`);

  useEffect(() => {
    const fetchWalletAddress = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setDoctorWallet(accounts[0]);
        } catch (error) {
          console.error("MetaMask connection error:", error);
          setDoctorWallet("Error fetching wallet");
        }
      } else {
        setDoctorWallet("MetaMask not installed");
      }
    };
    fetchWalletAddress();
  }, []);

  const handleCreateRecord = async () => {
    if (!diagnosis || !prescription || !gender) {
      setError("Please fill all fields before creating a record.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const sender = accounts[0];

        await web3.eth.sendTransaction({
          from: sender,
          to: "0x0000000000000000000000000000000000000000",
          value: web3.utils.toWei("0.001", "ether"),
        });

        const prescriptionData = {
          recordId,
          patientName: patient.name || "Unknown",
          gender,
          doctorWallet,
          diagnosis,
          prescription,
          timestamp: new Date().toISOString(),
        };

        const prescriptionBlob = new Blob([JSON.stringify(prescriptionData, null, 2)], { type: "application/json" });
        const prescriptionFile = new File([prescriptionBlob], `prescription_${recordId}.json`, { type: "application/json" });

        const cid = await uploadToPinata(prescriptionFile);

        if (cid) {
          saveRecordToLocalStorage(patient.id, recordId, cid);
          setSuccess(true);
          alert("Record successfully created and uploaded to IPFS!");

          const doctorHhNumber = localStorage.getItem("doctorHhNumber");
          if (doctorHhNumber) {
            navigate(`/doctor/${doctorHhNumber}`);
          } else {
            alert("Doctor HH Number not found in localStorage.");
          }
        } else {
          throw new Error("Failed to upload to IPFS.");
        }
      } else {
        setError("MetaMask is not connected. Please install and connect.");
      }
    } catch (error) {
      console.error("Error creating record:", error);
      setError(error.message || "An error occurred while creating the record.");
    } finally {
      setLoading(false);
    }
  };

  const saveRecordToLocalStorage = (patientId, recordId, ipfsHash) => {
    let storedRecords = JSON.parse(localStorage.getItem("records")) || {};
    if (!storedRecords[patientId]) {
      storedRecords[patientId] = [];
    }
    storedRecords[patientId].push({ recordId, ipfsHash, uploadedAt: new Date().toISOString() });
    localStorage.setItem("records", JSON.stringify(storedRecords));
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 text-white min-h-screen flex flex-col items-center">
      <NavBar_Logout />
      <h2 className="text-2xl font-semibold mt-6">Consultancy</h2>
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-xl md:max-w-2xl mt-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-gray-300">Record ID:</label>
            <input type="text" value={recordId} disabled className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-300">Patient Name:</label>
            <input type="text" value={patient.name || "Unknown"} disabled className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-300">Doctor Wallet Address:</label>
            <input type="text" value={doctorWallet} disabled className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" />
          </div>
          <div className="col-span-1">
            <label className="block text-gray-300">Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-gray-300">Diagnosis:</label>
            <textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"></textarea>
          </div>
          <div className="col-span-1">
            <label className="block text-gray-300">Prescription:</label>
            <textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"></textarea>
          </div>
          {error && <p className="text-red-500 col-span-2">{error}</p>}
          {success && <p className="text-green-500 col-span-2">Record successfully created!</p>}
          <div className="col-span-2 flex justify-center mt-6 space-x-4">
            <button onClick={handleCreateRecord} disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
              {loading ? "Processing..." : "Create Record"}
            </button>
            <button onClick={() => navigate(-1)} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorForm;
