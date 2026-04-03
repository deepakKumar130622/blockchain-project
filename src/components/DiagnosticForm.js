import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadToPinata } from "../pinataUpload";
import NavBar_Logout from "./NavBar_Logout";
import Web3 from "web3";

const DiagnosticForm = () => {
  const { hhNumber: diagnosticHhFromUrl } = useParams();
  const navigate = useNavigate();

  const [recordId] = useState(() =>
    new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14)
  );

  const [patientHhNumber, setPatientHhNumber] = useState("");
  const [diagnosticHhNumber] = useState(diagnosticHhFromUrl || "");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const fetchWalletAddress = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setWalletAddress(accounts[0]);
        } catch (err) {
          console.error("MetaMask connection error:", err);
        }
      }
    };

    fetchWalletAddress();
  }, []);

  const saveToLocalStorage = (patientHhNumber, fileHash, fileName) => {
    let storedRecords = JSON.parse(localStorage.getItem("records")) || {};
    if (!storedRecords[patientHhNumber]) {
      storedRecords[patientHhNumber] = [];
    }

    const newRecord = {
      recordId,
      doctorName,
      patientName,
      age,
      bloodGroup,
      gender,
      walletAddress,
      ipfsHash: fileHash,
      fileName,
      uploadedAt: new Date().toISOString(),
      diagnosticHhNumber,
    };

    storedRecords[patientHhNumber].push(newRecord);
    localStorage.setItem("records", JSON.stringify(storedRecords));
    window.dispatchEvent(new Event("storage"));
  };

  const handleUpload = async () => {
    if (
      !patientHhNumber ||
      patientHhNumber.length !== 6 ||
      !doctorName ||
      !patientName ||
      !age ||
      !bloodGroup ||
      !gender ||
      !walletAddress ||
      !file
    ) {
      alert("❌ Please fill in all fields and upload a file.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        const transaction = {
          from: accounts[0],
          to: "0x0000000000000000000000000000000000000000",
          value: web3.utils.toWei("0.001", "ether"),
        };

        await web3.eth.sendTransaction(transaction);
      } else {
        alert("❌ MetaMask is not installed.");
        setIsUploading(false);
        return;
      }

      const fileHash = await uploadToPinata(file);
      if (!fileHash) {
        setError("❌ Upload failed. Try again.");
        setIsUploading(false);
        return;
      }

      saveToLocalStorage(patientHhNumber, fileHash, file.name);
      alert("✅ File uploaded and saved!");
      await new Promise((res) => setTimeout(res, 100));
      navigate(`/diagnostic/${diagnosticHhNumber}`);
    } catch (error) {
      console.error(error);
      setError("❌ File upload failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <NavBar_Logout />
      <div className="flex justify-center items-center px-4 py-12">
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-blue-400 mb-10">
            📄 Upload Diagnostic Report
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Box label="Record ID" value={recordId} disabled />
            <Box
              label="Patient HH Number"
              placeholder="Enter 6-digit HH Number"
              value={patientHhNumber}
              onChange={(e) => /^\d{0,6}$/.test(e.target.value) && setPatientHhNumber(e.target.value)}
            />
            <Box label="Doctor Name" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
            <Box label="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
            <Box type="number" label="Age" value={age} onChange={(e) => setAge(e.target.value)} />
            <SelectBox
              label="Blood Group"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
            />
            <SelectBox
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              options={["Male", "Female", "Other"]}
            />
            <Box label="Diagnostic HH Number" value={diagnosticHhNumber} disabled />
            <Box label="Wallet Address" value={walletAddress} disabled />
          </div>

          <div className="mt-8 bg-white/10 border border-white/20 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Diagnostic Report File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 hover:file:bg-blue-700"
            />
          </div>

          {error && <p className="text-red-400 mt-4">{error}</p>}

          <div className="mt-10 text-center">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-700 font-semibold shadow-lg transition duration-300"
            >
              {isUploading ? "Uploading..." : "Upload Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 📦 Reusable styled input box
const Box = ({ label, ...props }) => (
  <div className="bg-white/10 border border-white/20 rounded-xl p-4">
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      {...props}
    />
  </div>
);

// 📦 Reusable styled select box
const SelectBox = ({ label, value, onChange, options }) => (
  <div className="bg-white/10 border border-white/20 rounded-xl p-4">
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <select
      className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      value={value}
      onChange={onChange}
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default DiagnosticForm;
