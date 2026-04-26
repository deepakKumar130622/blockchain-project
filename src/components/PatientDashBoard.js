import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useParams, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

const PatientDashBoard = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState(null);

  const viewRecord = () => navigate(`/patient/${hhNumber}/viewrecords`);
  const viewProfile = () => navigate(`/patient/${hhNumber}/viewprofile`);
  const uploadRecords = () => navigate(`/patient/${hhNumber}/uploadrecords`);
  const grantPermission = () => navigate(`/patient/${hhNumber}/grantaccess`);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = PatientRegistration.networks[networkId];

          if (!deployedNetwork) {
            setError("Smart contract not deployed on current network.");
            return;
          }

          const contractInstance = new web3Instance.eth.Contract(
            PatientRegistration.abi,
            deployedNetwork.address
          );
          setContract(contractInstance);

          const result = await contractInstance.methods.getPatientDetails(hhNumber).call();
          if (result) {
            setPatientDetails(result);
          }
        } catch (err) {
          console.error("Error retrieving patient details:", err);
          setError("Failed to load patient details.");
        }
      } else {
        setError("Please install MetaMask extension.");
      }
    };

    init();
  }, [hhNumber]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white font-[Times_New_Roman]">
      <NavBar_Logout />
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 py-10">
        <div className="w-full max-w-5xl bg-gray-800 bg-opacity-40 backdrop-blur-md border border-gray-700 rounded-2xl p-10 shadow-2xl text-center transition-all duration-500">
          <h2 className="text-4xl font-extrabold mb-6">Patient Dashboard</h2>

          {error ? (
            <p className="text-red-500 text-xl">{error}</p>
          ) : patientDetails ? (
            <p className="text-2xl mb-10">
              Welcome{" "}
              <span className="font-bold text-yellow-400">{patientDetails.name}</span>!
            </p>
          ) : (
            <p className="text-gray-400">Loading patient details...</p>
          )}

          {/* Dashboard Buttons - Wrapped and Fitted */}
          <div className="flex flex-wrap justify-center gap-6">
            {[["View Profile", viewProfile], ["View Records", viewRecord], ["Upload Past Records", uploadRecords], ["Grant Permission", grantPermission]].map(([label, handler]) => (
              <button
                key={label}
                onClick={handler}
                className="w-[200px] px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-medium text-lg rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashBoard;
