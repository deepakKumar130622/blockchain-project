import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useParams, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import DiagnosticRegistration from "../build/contracts/DiagnosticRegistration.json";

const DiagnosticDashBoard = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [diagnosticDetails, setDiagnosticDetails] = useState(null);
  const [error, setError] = useState(null);

  const diagnosticUpload = () => {
    navigate(`/diagnostic/${hhNumber}/diagnosticform`);
  };

  const viewDiagnosticProfile = () => {
    navigate(`/diagnostic/${hhNumber}/viewdiagnosticprofile`);
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DiagnosticRegistration.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            DiagnosticRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);

          const result = await contractInstance.methods.getDiagnosticDetails(hhNumber).call();
          setDiagnosticDetails(result);
        } catch (error) {
          console.error('Error initializing Web3 or fetching diagnostic details:', error);
          setError('Error initializing Web3 or fetching diagnostic details');
        }
      } else {
        console.error('Please install MetaMask extension');
        setError('Please install MetaMask extension');
      }
    };

    init();
  }, [hhNumber]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white font-[Times_New_Roman]">
      <NavBar_Logout />
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 py-10">
        <div className="w-full max-w-4xl bg-gray-800 bg-opacity-40 backdrop-blur-md border border-gray-700 rounded-2xl p-10 shadow-2xl text-center transition-all duration-500">
          <h2 className="text-4xl font-extrabold mb-6">Diagnostic Dashboard</h2>

          {error ? (
            <p className="text-red-500 text-xl">{error}</p>
          ) : diagnosticDetails ? (
            <p className="text-2xl mb-10">
              Welcome{" "}
              <span className="font-bold text-yellow-400">{diagnosticDetails[1]}</span>!
            </p>
          ) : (
            <p className="text-gray-400">Loading diagnostic details...</p>
          )}

          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={viewDiagnosticProfile}
              className="min-w-[200px] px-6 py-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold text-lg rounded-xl shadow-md transition-transform transform hover:scale-105"
            >
              View Profile
            </button>
            <button
              onClick={diagnosticUpload}
              className="min-w-[200px] px-6 py-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold text-lg rounded-xl shadow-md transition-transform transform hover:scale-105"
            >
              Create Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticDashBoard;
