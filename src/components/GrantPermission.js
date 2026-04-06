import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import NavBar_Logout from "./NavBar_Logout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

const GrantPermission = () => {
  const [doctorHHNumber, setDoctorHHNumber] = useState("");
  const [loggedInPatient, setLoggedInPatient] = useState(null);
  const [authorizedDoctors, setAuthorizedDoctors] = useState([]);
  const [message, setMessage] = useState(null);
  const [currentWallet, setCurrentWallet] = useState(null);
  const navigate = useNavigate();

  const fetchDoctors = async (patient) => {
    if (!patient) return;
    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PatientRegistration.networks[networkId];
      if (deployedNetwork) {
        const contract = new web3.eth.Contract(PatientRegistration.abi, deployedNetwork.address);
        const doctors = await contract.methods.getDoctorList(patient.id.toString()).call();
        setAuthorizedDoctors(doctors);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

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

        let patient = JSON.parse(localStorage.getItem("loggedInPatient"));

        if (patient && patient.walletAddress?.toLowerCase() === walletAddress) {
          setLoggedInPatient(patient);
          setMessage(null);
          fetchDoctors(patient);
        } else {
          setMessage({
            text: "❌ Mismatch or no logged-in patient found for this MetaMask account.",
            type: "error",
          });
          setLoggedInPatient(null);
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
          text: "⚠️ MetaMask account mismatch! Switch to the correct patient wallet in MetaMask.",
          type: "warning",
        });
        return;
      }

      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PatientRegistration.networks[networkId];
      if (!deployedNetwork) {
        setMessage({ text: "Contract not deployed on current network.", type: "error" });
        return;
      }

      const contract = new web3.eth.Contract(PatientRegistration.abi, deployedNetwork.address);

      setMessage({ text: "⏳ Granting access on the blockchain... Please confirm the transaction.", type: "warning" });

      await contract.methods.grantPermission(
        loggedInPatient.id.toString(),
        doctorHHNumber,
        loggedInPatient.name
      ).send({ from: patientWallet, gas: 3000000 });

      setMessage({ text: `✅ Access granted to Doctor HH: ${doctorHHNumber}`, type: "success" });
      setDoctorHHNumber("");
      fetchDoctors(loggedInPatient); // Update list
    } catch (err) {
      console.error(err);
      setMessage({ text: "❌ Error granting access. It may have already been granted, or you rejected the transaction.", type: "error" });
    }
  };

  const handleRevokeAccess = async () => {
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
          text: "⚠️ MetaMask account mismatch! Switch to the correct patient wallet in MetaMask.",
          type: "warning",
        });
        return;
      }

      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PatientRegistration.networks[networkId];
      if (!deployedNetwork) {
        setMessage({ text: "Contract not deployed on current network.", type: "error" });
        return;
      }

      const contract = new web3.eth.Contract(PatientRegistration.abi, deployedNetwork.address);

      setMessage({ text: "⏳ Revoking access on the blockchain... Please confirm the transaction.", type: "warning" });

      await contract.methods.revokePermission(
        loggedInPatient.id.toString(),
        doctorHHNumber
      ).send({ from: patientWallet, gas: 3000000 });

      setMessage({ text: `✅ Access revoked from Doctor HH: ${doctorHHNumber}`, type: "success" });
      setDoctorHHNumber("");
      fetchDoctors(loggedInPatient); // Update list
    } catch (err) {
      console.error(err);
      setMessage({ text: "❌ Error revoking access. Access may not exist, or you rejected the transaction.", type: "error" });
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
              <p className={message.type === "success" ? "text-green-500 font-semibold text-lg" : "text-yellow-500 font-semibold text-lg"}>
                {message.text}
              </p>
            </div>
          )}

          {authorizedDoctors.length > 0 && (
            <div className="mt-8 text-white">
              <h3 className="text-lg font-semibold mb-3">Doctors with Access:</h3>
              <div className="space-y-3">
                {authorizedDoctors.map((docHH, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-700 rounded-xl p-4 text-sm text-white shadow-md flex justify-between items-center"
                  >
                    <p className="font-semibold text-yellow-400">
                      Doctor HH: <span className="text-white">{docHH}</span>
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
