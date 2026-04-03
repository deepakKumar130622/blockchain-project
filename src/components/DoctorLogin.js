import React, { useState } from "react";
import Web3 from "web3";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [hhNumberError, sethhNumberError] = useState("");
  const [hhNumber, sethhNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlehhNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      sethhNumber(value);
      if (value.length === 6) {
        sethhNumberError("");
      } else {
        sethhNumberError("HH Number must be exactly 6 digits.");
      }
    }
  };

  const handleCheckRegistration = async () => {
    if (hhNumber.length !== 6) {
      sethhNumberError("HH Number must be exactly 6 digits.");
      return;
    }

    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DoctorRegistration.networks[networkId];
      const contract = new web3.eth.Contract(
        DoctorRegistration.abi,
        deployedNetwork && deployedNetwork.address
      );

      const isRegistered = await contract.methods
        .isRegisteredDoctor(hhNumber)
        .call();

      if (isRegistered) {
        const isValidPassword = await contract.methods
          .validatePassword(hhNumber, password)
          .call();

        if (isValidPassword) {
          const doctor = await contract.methods
            .getDoctorDetails(hhNumber)
            .call();

          localStorage.setItem("role", "doctor");
          navigate("/doctor/" + hhNumber);
        } else {
          alert("Incorrect password");
        }
      } else {
        alert("Doctor not registered");
      }
    } catch (error) {
      console.error("Error checking registration:", error);
      alert("An error occurred while checking registration.");
    }
  };

  const cancelOperation = () => {
    navigate("/");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white font-[Times_New_Roman] overflow-hidden">
      <NavBar />

      {/* Bright Rotating Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <img
        src="/bg.png"
        alt="Rotating 3D Hospital Plus"
        className="brightness-[3.5] saturate-0 contrast-150 opacity-70 w-[300px] h-[300px] md:w-[400px] md:h-[400px] drop-shadow-[0_0_100px_rgba(255,255,255,0.9)] animate-spin-slow"
        />
      </div>

      <div className="relative z-10 flex justify-center items-center min-h-[calc(100vh-80px)] px-4 py-10">
        <div className="w-full max-w-xl bg-gray-800 bg-opacity-40 backdrop-blur-md border border-gray-700 rounded-2xl p-10 shadow-2xl transition-all duration-500">
          <h2 className="text-4xl font-extrabold text-center mb-8">Doctor Login</h2>

          {/* HH Number */}
          <div className="mb-6">
            <label className="block font-semibold mb-2" htmlFor="hhNumber">
              HH Number
            </label>
            <input
              id="hhNumber"
              type="text"
              inputMode="numeric"
              maxLength={6}
              pattern="\d*"
              value={hhNumber}
              onChange={handlehhNumberChange}
              placeholder="Enter your 6-digit HH Number"
              className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${
                hhNumberError ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400`}
            />
            {hhNumberError && (
              <p className="text-red-500 text-sm mt-2">{hhNumberError}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-12 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-3 text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a10.05 10.05 0 01.175-1.875M15 9l-6 6m0-6l6 6" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.275.888-.673 1.724-1.176 2.49" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleCheckRegistration}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold text-lg rounded-lg shadow-md transition-transform hover:scale-105"
            >
              Login
            </button>
            <button
              onClick={cancelOperation}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold text-lg rounded-lg shadow-md transition-transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
