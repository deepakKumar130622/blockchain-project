import React, { useState, useEffect } from "react";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import Web3 from "web3";
import { useNavigate, useParams } from "react-router-dom";
import "../CSS/PatientWritePermission.css";
import "../big_css/CreateEHR.css";
import NavBar_Logout from "./NavBar_Logout";

const ViewDoctorProfile = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DoctorRegistration.networks[networkId];
          const contract = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );

          const result = await contract.methods.getDoctorDetails(hhNumber).call();
          setDoctorDetails(result);
        } else {
          setError("Please install MetaMask extension");
        }
      } catch (error) {
        console.error('Error retrieving doctor details:', error);
        setError('Error retrieving doctor details');
      }
    };

    fetchDoctorDetails();
  }, [hhNumber]);

  const cancelOperation = () => navigate(`/doctor/${hhNumber}`);

  const parseDOB = (dobString) => {
    try {
      const match = dobString.match(/^(\d{4})\d*-(\d{2})-(\d{2})$/);
      if (match) return `${match[1]}-${match[2]}-${match[3]}`;
      return new Date(dobString).toISOString().slice(0, 10);
    } catch {
      return dobString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white font-sans tracking-wide">
      <NavBar_Logout />
      <div className="flex justify-center items-center px-4 py-16">
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 shadow-2xl transition-all duration-300 animate-fade-in">
          <h2 className="text-4xl font-bold text-center text-cyan-400 mb-10 drop-shadow-md">
            🧑‍⚕️ Doctor's Profile
          </h2>

          {error ? (
            <p className="text-red-500 text-center font-semibold">{error}</p>
          ) : doctorDetails ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base sm:text-lg">
              <ProfileLine label="Name" value={doctorDetails[1]} />
              <ProfileLine label="DOB" value={parseDOB(doctorDetails[3])} />
              <ProfileLine label="Gender" value={doctorDetails[4]} />
              <ProfileLine label="Hospital Name" value={doctorDetails[2]} />
              <ProfileLine label="Specialization" value={doctorDetails[6]} />
              <ProfileLine label="Department" value={doctorDetails[7]} />
              <ProfileLine label="Designation" value={doctorDetails[8]} />
              <ProfileLine label="Work Experience" value={doctorDetails[9]} />
              <ProfileLine label="Email-Id" value={doctorDetails[5]} />
              <ProfileLine label="HH Number" value={hhNumber} />
            </div>
          ) : (
            <p className="text-white text-center">Loading doctor details...</p>
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
    <span className="text-yellow-400 font-semibold mt-1 sm:mt-0">{value || "N/A"}</span>
  </div>
);

export default ViewDoctorProfile;
