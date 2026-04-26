import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import supabase from "../supabaseClient";

function DoctorViewRecords() {
  const { hhNumber } = useParams(); // Doctor's HH number from URL
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [patientDetails, setPatientDetails] = useState(null);
  const [patientHhNumber, setPatientHhNumber] = useState(null);

  useEffect(() => {
    // Get the patient HH number the doctor is viewing (stored when doctor clicks on a patient)
    const storedPatientHh = localStorage.getItem("viewingPatientHh");
    if (storedPatientHh) {
      setPatientHhNumber(storedPatientHh);
    }

    // Load IPFS records from localStorage (blockchain-managed)
    const storedRecords = JSON.parse(localStorage.getItem("records")) || {};
    const doctorRecords = storedRecords[hhNumber] || [];
    setRecords(doctorRecords);
  }, [hhNumber]);

  useEffect(() => {
    if (!patientHhNumber) return;

    const fetchPatientFromSupabase = async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("hh_number", patientHhNumber)
        .single();

      if (error) {
        console.error("❌ Failed to fetch patient from Supabase:", error.message);
      } else {
        setPatientDetails(data);
      }
    };

    fetchPatientFromSupabase();
  }, [patientHhNumber]);

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 text-white min-h-screen flex flex-col items-center p-10" style={{ fontFamily: 'Times New Roman, serif' }}>
      <NavBar_Logout />

      <h3 className="text-xl font-bold mt-4">Patient's Profile</h3>

      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-lg shadow-lg mt-4">
        {patientDetails ? (
          <>
            <p className="text-lg"><span className="font-bold text-yellow-400">Name :</span> {patientDetails.name}</p>
            <p className="text-lg"><span className="font-bold text-yellow-400">DOB :</span> {patientDetails.date_of_birth}</p>
            <p className="text-lg"><span className="font-bold text-yellow-400">Gender :</span> {patientDetails.gender}</p>
            <p className="text-lg"><span className="font-bold text-yellow-400">Blood Group :</span> {patientDetails.blood_group}</p>
            <p className="text-lg"><span className="font-bold text-yellow-400">Address :</span> {patientDetails.home_address}</p>
            <p className="text-lg"><span className="font-bold text-yellow-400">Email-Id :</span> <span className="text-blue-400">{patientDetails.email}</span></p>
          </>
        ) : (
          <p className="text-gray-400">
            {patientHhNumber ? "Loading patient details..." : "No patient selected."}
          </p>
        )}
      </div>

      {/* Display Uploaded Records */}
      <h3 className="text-xl font-bold mt-6">Uploaded Records</h3>
      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-lg shadow-lg mt-4">
        {records.length === 0 ? (
          <p className="text-lg text-center">No records available.</p>
        ) : (
          <ul>
            {records.map((record, index) => (
              <li key={index} className="p-4 border-b border-gray-700">
                <p className="text-lg"><span className="font-bold text-yellow-400">File Name:</span> {record.fileName}</p>
                <p className="text-lg"><span className="font-bold text-yellow-400">IPFS Link:</span>{" "}
                  <a href={`https://gateway.pinata.cloud/ipfs/${record.ipfsHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400">
                    {record.ipfsHash}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-between w-full max-w-2xl mt-6">
        <button className="bg-green-600 p-2 rounded hover:bg-green-700 w-1/3">View Record</button>
        <button className="bg-blue-600 p-2 rounded hover:bg-blue-700 w-1/3">Prescription Consultancy</button>
        <button onClick={() => navigate(-1)} className="bg-red-600 p-2 rounded hover:bg-red-700 w-1/3">Close</button>
      </div>
    </div>
  );
}

export default DoctorViewRecords;
