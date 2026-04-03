import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useParams, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";

const DoctorDashBoardPage = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState(null);

  const viewPatientList = () => {
    navigate(`/doctor/${hhNumber}/patientlist`);
  };

  const viewDoctorProfile = () => {
    navigate(`/doctor/${hhNumber}/viewdoctorprofile`);
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DoctorRegistration.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);

          const result = await contractInstance.methods.getDoctorDetails(hhNumber).call();
          setDoctorDetails(result);
        } catch (error) {
          console.error("Error initializing Web3 or fetching doctor details:", error);
          setError("Error initializing Web3 or fetching doctor details");
        }
      } else {
        console.error("Please install MetaMask extension");
        setError("Please install MetaMask extension");
      }
    };

    init();
  }, [hhNumber]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white font-[Times_New_Roman]">
      <NavBar_Logout />
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 py-10">
        <div className="w-full max-w-2xl bg-gray-800 bg-opacity-40 backdrop-blur-md border border-gray-700 rounded-2xl p-10 shadow-2xl transition-all duration-500 text-center">
          <h2 className="text-4xl font-extrabold mb-6">Doctor Dashboard</h2>

          {doctorDetails && (
            <p className="text-2xl mb-12">
              Welcome{" "}
              <span className="font-bold text-yellow-400">{doctorDetails[1]}</span>!
            </p>
          )}

          {error && (
            <p className="text-red-500 text-lg font-semibold mb-6">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={viewDoctorProfile}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              View Profile
            </button>
            <button
              onClick={viewPatientList}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              View Patient List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashBoardPage;
