import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import { useNavigate } from "react-router-dom";
import "../CSS/DoctorLoginPage.css";
import NavBar from "./NavBar";

const PatientLogin = () => {
  const navigate = useNavigate();
  const [hhNumber, sethhNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hhNumberError, sethhNumberError] = useState("");
  const [message, setMessage] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const fetchMetaMaskAccount = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.requestAccounts();
          if (accounts.length > 0) {
            setWalletAddress(accounts[0].toLowerCase());
            console.log("🦊 MetaMask Account Fetched:", accounts[0]);
          }
        } catch (error) {
          console.error("❌ MetaMask Connection Error:", error);
          setMessage({ text: "MetaMask connection failed. Try again.", type: "error" });
        }
      } else {
        setMessage({ text: "MetaMask not installed.", type: "error" });
      }
    };

    fetchMetaMaskAccount();
  }, []);

  const handlehhNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      sethhNumber(value);
      sethhNumberError(value.length < 6 ? "HH Number must be exactly 6 digits." : "");
    }
  };

  const handleLogin = async () => {
    if (!hhNumber.trim() || !password.trim()) {
      setMessage({ text: "Please enter both HH Number and Password.", type: "error" });
      return;
    }

    if (hhNumber.length !== 6) {
      setMessage({ text: "HH Number must be exactly 6 digits.", type: "error" });
      return;
    }

    if (!window.ethereum) {
      setMessage({ text: "MetaMask is not installed.", type: "error" });
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PatientRegistration.networks[networkId];

      if (!deployedNetwork) {
        setMessage({ text: "Contract not deployed on the current network.", type: "error" });
        return;
      }

      const contract = new web3.eth.Contract(PatientRegistration.abi, deployedNetwork.address);
      const isRegistered = await contract.methods.isRegisteredPatient(hhNumber).call();
      if (!isRegistered) {
        setMessage({ text: "No registered patient found for this HH Number.", type: "error" });
        return;
      }

      const isValidPassword = await contract.methods.validatePassword(hhNumber, password).call();
      if (!isValidPassword) {
        setMessage({ text: "Incorrect password.", type: "error" });
        return;
      }

      const patientDetails = await contract.methods.getPatientDetails(hhNumber).call();
      const storedWalletAddress = patientDetails.walletAddress.toLowerCase();

      if (walletAddress !== storedWalletAddress) {
        setMessage({ text: "Logged-in account does not match registered MetaMask account!", type: "error" });
        return;
      }

      const loggedInPatient = {
        id: hhNumber,
        name: patientDetails.name,
        walletAddress: storedWalletAddress,
      };

      localStorage.setItem("loggedInPatient", JSON.stringify(loggedInPatient));
      localStorage.setItem("role", "patient");

      setMessage({ text: "Login successful!", type: "success" });
      console.log("✅ Logged-in Patient:", loggedInPatient);
      navigate(`/patient/${hhNumber}`);
    } catch (error) {
      console.error("❌ Login Error:", error);
      setMessage({ text: "Login failed. Please try again.", type: "error" });
    }
  };

  return (
    <div>
      <NavBar />
      <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center px-4 py-12 font-['Times_New_Roman'] text-white">
        <div className="w-full max-w-3xl bg-gray-900 bg-opacity-90 p-10 sm:p-16 rounded-2xl shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Patient Login</h2>

          <div className="mb-6">
            <label className="block font-bold text-lg mb-2">Patient ID</label>
            <input
              type="text"
              placeholder="Enter HH Number"
              value={hhNumber}
              maxLength={6}
              onChange={handlehhNumberChange}
              className={`p-3 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200 ${
                hhNumberError && "border-red-500"
              }`}
            />
            {hhNumberError && <p className="text-red-500 text-sm mt-2">{hhNumberError}</p>}
          </div>

          <div className="mb-6">
            <label className="block font-bold text-lg mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 w-full text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  // 👁️ Hide Icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a10.05 10.05 0 01.175-1.875M15 9l-6 6m0-6l6 6" />
                  </svg>
                ) : (
                  // 👁️ Show Icon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.275.888-.673 1.724-1.176 2.49" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {walletAddress ? (
            <p className="text-green-400 text-sm mb-4">✅ Connected Wallet: {walletAddress}</p>
          ) : (
            <p className="text-red-400 text-sm mb-4">❌ MetaMask not connected</p>
          )}

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-8">
            <button
              onClick={handleLogin}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg rounded-xl shadow-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-lg rounded-xl shadow-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300"
            >
              Cancel
            </button>
          </div>

          {message && (
            <p
              className={`mt-6 text-center py-3 px-4 rounded-lg text-lg ${
                message.type === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
