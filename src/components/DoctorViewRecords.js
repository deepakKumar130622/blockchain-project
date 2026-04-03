import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";

function DoctorViewRecords() {
  const { hhNumber } = useParams(); // Doctor's HH number
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = () => {
      const grantedAccess = JSON.parse(localStorage.getItem("grantedAccess")) || {};
      const doctorRecords = grantedAccess[hhNumber] || [];
      setRecords(doctorRecords);
    };

    fetchRecords();
  }, [hhNumber]);

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 text-white min-h-screen flex flex-col items-center p-10" style={{ fontFamily: 'Times New Roman, serif' }}>
      <NavBar_Logout />
      
      <h3 className="text-xl font-bold mt-4">Patient's Profile</h3>
      
      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-lg shadow-lg mt-4">
        <p className="text-lg"><span className="font-bold text-yellow-400">Name :</span> Tanmay Pradhan</p>
        <p className="text-lg"><span className="font-bold text-yellow-400">DOB :</span> 2008-12-04</p>
        <p className="text-lg"><span className="font-bold text-yellow-400">Gender :</span> Male</p>
        <p className="text-lg"><span className="font-bold text-yellow-400">Blood Group :</span> A+</p>
        <p className="text-lg"><span className="font-bold text-yellow-400">Address :</span> Mumbai</p>
        <p className="text-lg"><span className="font-bold text-yellow-400">Email-Id :</span> <span className="text-blue-400">tanmaypradhan@gmail.com</span></p>
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
                <p className="text-lg"><span className="font-bold text-yellow-400">IPFS Link:</span> 
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
        <button className="bg-red-600 p-2 rounded hover:bg-red-700 w-1/3">Close</button>
      </div>
      
      <footer className="w-full mt-10 p-4 bg-gray-900 text-center text-white">
        <p className="text-lg font-semibold">Contact Information</p>
        <p>Address: 123 Street, City, Country</p>
        <p>Phone: +123 456 7890</p>
        <p>Email: example@company.com</p>
        
        <div className="flex justify-center mt-4 space-x-6">
          <span className="text-lg">Useful Links</span>
          <span className="text-lg">Other Links</span>
        </div>
      </footer>
    </div>
  );
}

export default DoctorViewRecords;
