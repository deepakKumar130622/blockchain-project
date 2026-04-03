import React, { useState, useEffect } from "react";
import Web3 from "web3";
import DiagnosticRegistration from "../build/contracts/DiagnosticRegistration.json";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { FiEye, FiEyeOff } from "react-icons/fi";

const DiagnosticLogin = () => {
  const navigate = useNavigate();
  const [hhNumber, sethhNumber] = useState("");
  const [password, setPassword] = useState("");
  const [hhNumberError, sethhNumberError] = useState("");
  const [message, setMessage] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.requestAccounts();
          setWalletAddress(accounts[0]?.toLowerCase());
        } catch (err) {
          setMessage({ text: "Failed to connect MetaMask.", type: "error" });
        }
      } else {
        setMessage({ text: "MetaMask not installed.", type: "error" });
      }
    };
    fetchWallet();
  }, []);

  const handlehhNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      sethhNumber(value);
      sethhNumberError(value.length === 6 ? "" : "HH Number must be exactly 6 digits.");
    }
  };

  const handleLogin = async () => {
    if (hhNumber.length !== 6) {
      setMessage({ text: "HH Number must be exactly 6 digits.", type: "error" });
      return;
    }
    if (!password.trim()) {
      setMessage({ text: "Password cannot be empty.", type: "error" });
      return;
    }
    if (!window.ethereum) {
      setMessage({ text: "MetaMask not available.", type: "error" });
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DiagnosticRegistration.networks[networkId];
      if (!deployedNetwork) {
        setMessage({ text: "Smart contract not deployed on this network.", type: "error" });
        return;
      }

      const contract = new web3.eth.Contract(DiagnosticRegistration.abi, deployedNetwork.address);

      const isRegistered = await contract.methods.isRegisteredDiagnostic(hhNumber).call();
      if (!isRegistered) {
        setMessage({ text: "No diagnostic found with this HH Number.", type: "error" });
        return;
      }

      const isValidPassword = await contract.methods.validatePassword(hhNumber, password).call();
      if (!isValidPassword) {
        setMessage({ text: "Incorrect password.", type: "error" });
        return;
      }

      const diagnostic = await contract.methods.getDiagnosticDetails(hhNumber).call();
      console.log("Diagnostic object returned:", diagnostic);

      if (!diagnostic?._walletAddress) {
        setMessage({ text: "Diagnostic wallet address not found.", type: "error" });
        return;
      }

      if (walletAddress !== diagnostic._walletAddress.toLowerCase()) {
        setMessage({ text: "Logged-in wallet doesn't match registered wallet.", type: "error" });
        return;
      }

      const loggedInDiagnostic = {
        id: hhNumber,
        DiagnosticCenterName: diagnostic._diagnosticName,
        HospitalName: diagnostic._hospitalName,
        Location: diagnostic._diagnosticLocation,
        Email: diagnostic._email,
        walletAddress: diagnostic._walletAddress.toLowerCase(),
      };

      localStorage.setItem("loggedInDiagnostic", JSON.stringify(loggedInDiagnostic));
      setMessage({ text: "Login successful!", type: "success" });
      navigate(`/diagnostic/${hhNumber}`);
    } catch (err) {
      console.error("Login error:", err);
      setMessage({ text: "Something went wrong during login.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white font-[Times_New_Roman]">
      <NavBar />
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 py-10">
        <div className="w-full max-w-xl bg-gray-800 bg-opacity-40 border border-gray-700 rounded-2xl p-10 shadow-2xl transition-all duration-500">
          <h2 className="text-4xl font-extrabold text-center mb-8">Diagnostic Login</h2>

          <div className="mb-6">
            <label className="block font-semibold mb-2">HH Number</label>
            <input
              type="text"
              maxLength={6}
              inputMode="numeric"
              value={hhNumber}
              onChange={handlehhNumberChange}
              placeholder="Enter your 6-digit HH Number"
              className={`w-full px-4 py-3 rounded-lg bg-gray-700 border ${
                hhNumberError ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400`}
            />
            {hhNumberError && <p className="text-red-500 text-sm mt-2">{hhNumberError}</p>}
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {walletAddress && (
            <p className="text-green-400 text-sm mb-4">
              ✅ Connected Wallet: {walletAddress}
            </p>
          )}

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleLogin}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold text-lg rounded-lg shadow-md transition-transform hover:scale-105"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold text-lg rounded-lg shadow-md transition-transform hover:scale-105"
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

export default DiagnosticLogin;
