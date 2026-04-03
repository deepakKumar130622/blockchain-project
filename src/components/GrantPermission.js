import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import NavBar_Logout from "./NavBar_Logout";

const GrantPermission = () => {
  const [doctorHHNumber, setDoctorHHNumber] = useState("");
  const [loggedInPatient, setLoggedInPatient] = useState(null);
  const [message, setMessage] = useState(null);
  const [currentWallet, setCurrentWallet] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetaMaskAccount = async () => {
      if (!window.ethereum) {
        setMessage({ text: "⚠️ MetaMask is not installed.", type: "error" });
        return;
      }

      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();
        const walletAddress = accounts[0].toLowerCase();
        setCurrentWallet(walletAddress);

        let storedPatients = JSON.parse(localStorage.getItem("patients")) || [];
        let matchedPatient = storedPatients.find(
          (patient) => patient.walletAddress?.toLowerCase() === walletAddress
        );

        if (matchedPatient) {
          localStorage.setItem("loggedInPatient", JSON.stringify(matchedPatient));
          setLoggedInPatient(matchedPatient);
          setMessage(null);
        } else {
          setMessage({
            text: "❌ No registered patient found for this MetaMask account.",
            type: "error",
          });
          localStorage.removeItem("loggedInPatient");
        }
      } catch (error) {
        setMessage({ text: "⚠️ Error fetching MetaMask account.", type: "error" });
      }
    };

    fetchMetaMaskAccount();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
    }
  }, []);

  const handleGrantAccess = async () => {
    if (!doctorHHNumber.trim() || doctorHHNumber.length !== 6) {
      setMessage({ text: "⚠️ Please enter a valid 6-digit Doctor HH Number.", type: "error" });
      return;
    }

    if (!loggedInPatient) {
      setMessage({ text: "⚠️ No logged-in patient found. Please log in.", type: "error" });
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      const patientWallet = accounts[0].toLowerCase();

      if (patientWallet !== loggedInPatient.walletAddress.toLowerCase()) {
        setMessage({
          text: "⚠️ MetaMask account mismatch! Auto-fetching correct patient...",
          type: "warning",
        });
        setTimeout(() => window.location.reload(), 2000);
        return;
      }

      let storedPatients = JSON.parse(localStorage.getItem("patients")) || [];
      const index = storedPatients.findIndex((p) => p.id === loggedInPatient.id);
      const patient = storedPatients[index];

      if (!Array.isArray(patient.authorizedDoctors)) {
        patient.authorizedDoctors = [];
      }

      const alreadyExists = patient.authorizedDoctors.some(
        (entry) => entry.doctorHH === doctorHHNumber
      );

      if (!alreadyExists) {
        patient.authorizedDoctors.push({
          doctorHH: doctorHHNumber,
          grantedAt: new Date().toISOString(),
        });

        storedPatients[index] = patient;
        localStorage.setItem("patients", JSON.stringify(storedPatients));
        setLoggedInPatient(patient); // Update local state
        setDoctorHHNumber("");
        setMessage({ text: `✅ Access granted to Doctor HH: ${doctorHHNumber}`, type: "success" });
      } else {
        setMessage({ text: "⚠️ Doctor already has access.", type: "warning" });
      }
    } catch (err) {
      setMessage({ text: "❌ Error granting access.", type: "error" });
    }
  };

  const handleRevokeAccess = () => {
    if (!doctorHHNumber.trim() || doctorHHNumber.length !== 6) {
      setMessage({ text: "⚠️ Please enter a valid 6-digit Doctor HH Number.", type: "error" });
      return;
    }

    let storedPatients = JSON.parse(localStorage.getItem("patients")) || [];
    const index = storedPatients.findIndex((p) => p.id === loggedInPatient.id);

    if (index !== -1) {
      const patient = storedPatients[index];
      patient.authorizedDoctors = patient.authorizedDoctors.filter(
        (entry) => entry.doctorHH !== doctorHHNumber
      );
      storedPatients[index] = patient;
      localStorage.setItem("patients", JSON.stringify(storedPatients));
      setLoggedInPatient(patient);
      setMessage({ text: `✅ Access revoked from Doctor HH: ${doctorHHNumber}`, type: "success" });
      setDoctorHHNumber("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <NavBar_Logout />
      <div className="flex justify-center items-center flex-grow px-4 py-10">
        <div className="bg-gray-800 p-10 rounded-3xl shadow-2xl w-full max-w-xl">
          <h2 className="text-white text-3xl font-bold mb-6 text-center">Manage Doctor Access</h2>

          <label className="block text-gray-300 text-lg font-medium mb-2">Doctor HH Number:</label>
          <input
            type="text"
            placeholder="6-digit HH Number"
            value={doctorHHNumber}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d{0,6}$/.test(val)) setDoctorHHNumber(val);
            }}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData("text");
              if (!/^\d{1,6}$/.test(pasted)) e.preventDefault();
            }}
            maxLength={6}
            className="w-full p-4 rounded-xl text-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-between gap-4 mt-6">
            <button
              onClick={handleGrantAccess}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-xl font-semibold transition w-full"
            >
              Grant Access
            </button>
            <button
              onClick={handleRevokeAccess}
              className="bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-3 rounded-xl font-semibold transition w-full"
            >
              Revoke Access
            </button>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white text-lg py-3 rounded-xl font-semibold transition"
          >
            Cancel
          </button>

          {message && (
            <div className="mt-4 text-center">
              <p className="text-red-500 font-semibold text-lg">
                {message.text}
              </p>
            </div>
          )}

          {loggedInPatient?.authorizedDoctors?.filter(doc => doc.doctorHH).length > 0 && (
            <div className="mt-8 text-white">
              <h3 className="text-lg font-semibold mb-3">Doctors with Access:</h3>
              <div className="space-y-3">
                {loggedInPatient.authorizedDoctors
                  .filter((doc) => doc.doctorHH)
                  .map((doc, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-700 rounded-xl p-4 text-sm text-white shadow-md"
                    >
                      <p className="font-semibold text-yellow-400">
                        Doctor HH: <span className="text-white">{doc.doctorHH}</span>
                      </p>
                      <p className="text-gray-300">
                        Granted At: {new Date(doc.grantedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrantPermission;
