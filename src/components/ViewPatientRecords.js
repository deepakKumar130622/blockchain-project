import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";

const ViewPatientRecords = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  // Get user role from localStorage
  const role = localStorage.getItem("role");

  useEffect(() => {
    try {
      const storedRecords = JSON.parse(localStorage.getItem("records")) || {};
      const patientRecords = storedRecords[hhNumber] || [];

      if (Array.isArray(patientRecords)) {
        setRecords(patientRecords);
        setError(null);
      } else {
        setRecords([]);
        setError("Invalid record format");
      }
    } catch (error) {
      setRecords([]);
      setError("Error loading records");
      console.error("Error:", error);
    }
  }, [hhNumber]);

  const handleDelete = (index) => {
    try {
      let storedRecords = JSON.parse(localStorage.getItem("records")) || {};

      if (Array.isArray(storedRecords[hhNumber])) {
        const updatedRecords = storedRecords[hhNumber].filter((_, i) => i !== index);
        storedRecords[hhNumber] = updatedRecords;
        localStorage.setItem("records", JSON.stringify(storedRecords));
        setRecords(updatedRecords);
        setError(null);
      }
    } catch (error) {
      setError("Error deleting record");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white font-sans tracking-wide">
      <NavBar_Logout />
      <div className="flex justify-center items-center px-4 py-16">
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 shadow-2xl animate-fade-in transition-all duration-300">
          <h2 className="text-4xl font-bold text-center text-cyan-400 mb-10 drop-shadow-md">
            📁 Patient Records
          </h2>

          {error && (
            <p className="text-red-500 text-center font-semibold">{error}</p>
          )}

          {records.length === 0 ? (
            <p className="text-lg text-center">
              No records found for <span className="text-yellow-500 font-bold">{hhNumber}</span>
            </p>
          ) : (
            <ul className="space-y-4">
              {records.map((record, index) => (
                <li
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 shadow-inner hover:bg-white/10 transition duration-300 ease-in-out"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <p className="text-lg font-semibold text-yellow-400">
                        {record.fileName || `Prescription`}
                      </p>
                      <p className="text-sm text-gray-300 mt-1">
                        Uploaded on:{" "}
                        {new Date(record.uploadedAt).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })}
                      </p>
                    </div>

                    <div className="flex mt-4 sm:mt-0 sm:ml-4 space-x-3">
                      <button
                        className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-all"
                        onClick={() =>
                          window.open(`https://gateway.pinata.cloud/ipfs/${record.ipfsHash}`, "_blank")
                        }
                      >
                        View
                      </button>

                      {/* Display Delete button only for patients */}
                      {role === "patient" && (
                        <button
                          className="h-8 px-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition-all"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 rounded-full text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPatientRecords;
