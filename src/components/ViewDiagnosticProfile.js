import React, { useState, useEffect } from "react";
import DiagnosticRegistration from "../build/contracts/DiagnosticRegistration.json";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";

const ViewDiagnosticProfile = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [diagnosticDetails, setDiagnosticDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiagnosticDetails = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DiagnosticRegistration.networks[networkId];
          const contract = new web3Instance.eth.Contract(
            DiagnosticRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );

          const result = await contract.methods.getDiagnosticDetails(hhNumber).call();
          setDiagnosticDetails(result);
        } else {
          setError("❌ Please install MetaMask extension");
        }
      } catch (error) {
        console.error("❌ Error retrieving diagnostic details:", error);
        setError("Error retrieving diagnostic details");
      }
    };

    fetchDiagnosticDetails();
  }, [hhNumber]);

  const cancelOperation = () => navigate(`/diagnostic/${hhNumber}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white font-sans tracking-wide">
      <NavBar_Logout />
      <div className="flex justify-center items-center px-4 py-16">
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 shadow-2xl transition-all duration-300 animate-fade-in">
          <h2 className="text-4xl font-bold text-center text-cyan-400 mb-10 drop-shadow-md">
            🏥 Diagnostic Center Profile
          </h2>

          {error ? (
            <p className="text-red-500 text-center font-semibold">{error}</p>
          ) : diagnosticDetails ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base sm:text-lg">
              <ProfileLine label="Diagnostic Center Name" value={diagnosticDetails[1] || "N/A"} />
              <ProfileLine label="Hospital Name" value={diagnosticDetails[2] || "N/A"} />
              <ProfileLine label="Location" value={diagnosticDetails[3] || "N/A"} />
              <ProfileLine label="Email-Id" value={diagnosticDetails[4] || "N/A"} />
              <ProfileLine label="HH Number" value={hhNumber} />
            </div>
          ) : (
            <p className="text-white text-center">Loading diagnostic details...</p>
          )}

          <div className="mt-12 text-center">
            <button
              onClick={cancelOperation}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 rounded-full text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileLine = ({ label, value }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center text-left shadow-inner hover:bg-white/10 transition duration-300 ease-in-out">
    <span className="text-gray-300 font-medium">{label}:</span>
    <span className="text-yellow-400 font-semibold mt-1 sm:mt-0">{value}</span>
  </div>
);

export default ViewDiagnosticProfile;
