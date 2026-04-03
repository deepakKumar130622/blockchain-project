import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";

const ViewPatientList = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [records, setRecords] = useState({});
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [recordVisibility, setRecordVisibility] = useState({});

  const fetchPatientData = () => {
    const storedPatients = JSON.parse(localStorage.getItem("patients")) || [];
    const storedRecords = JSON.parse(localStorage.getItem("records")) || {};

    if (hhNumber) {
      const doctorHH = hhNumber.toString();
      const approvedPatients = storedPatients.filter(patient =>
        patient?.authorizedDoctors?.includes(doctorHH)
      );

      setPatients(approvedPatients);
      setRecords(storedRecords);
    }
  };

  useEffect(() => {
    fetchPatientData();
    const interval = setInterval(fetchPatientData, 5000);
    return () => clearInterval(interval);
  }, [hhNumber]);

  const toggleProfile = (patientId) => {
    setExpandedPatient((prev) => (prev === patientId ? null : patientId));
    setRecordVisibility({});
  };

  const toggleRecords = (patientId) => {
    setRecordVisibility((prev) => ({
      ...prev,
      [patientId]: !prev[patientId],
    }));
  };

  const handleDeleteRecord = (patientId, recordIndex) => {
    const updatedRecords = { ...records };
    updatedRecords[patientId] = updatedRecords[patientId].filter((_, i) => i !== recordIndex);
    localStorage.setItem("records", JSON.stringify(updatedRecords));
    setRecords(updatedRecords);
  };

  const handleConsultancy = (patient) => {
    navigate(`/doctor/${patient.id}/doctorform`, { state: { patient } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white font-sans">
      <NavBar_Logout />
      <div className="mt-8 px-4 sm:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-cyan-400 drop-shadow">
          Patients Who Granted Access
        </h2>

        <div className="max-w-5xl mx-auto">
          {patients.length === 0 ? (
            <p className="text-center text-lg text-gray-400">No patients have granted access yet.</p>
          ) : (
            <ul className="space-y-6">
              {patients.map((patient) => {
                const patientId = patient?.id?.toString() || "unknown";
                const patientRecords = records[patientId] || [];

                return (
                  <li key={patientId} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-md p-6 transition duration-300 hover:shadow-lg">
                    <button
                      className="w-full text-left text-lg font-semibold text-yellow-400 hover:text-white transition"
                      onClick={() => toggleProfile(patientId)}
                    >
                      {patient?.name ?? "Unknown"}
                      <span className="text-sm text-gray-400 ml-2">(Click to view details)</span>
                    </button>

                    {/* Patient Profile */}
                    {expandedPatient === patientId && (
                      <div className="mt-4 text-sm sm:text-base space-y-2 text-white">
                        <p><span className="font-bold text-yellow-300">Name:</span> {patient?.name ?? "N/A"}</p>
                        <p><span className="font-bold text-yellow-300">DOB:</span> {patient?.dob ?? "N/A"}</p>
                        <p><span className="font-bold text-yellow-300">Gender:</span> {patient?.gender ?? "N/A"}</p>
                        <p><span className="font-bold text-yellow-300">Blood Group:</span> {patient?.bloodGroup ?? "N/A"}</p>
                        <p><span className="font-bold text-yellow-300">Address:</span> {patient?.address ?? "N/A"}</p>
                        <p><span className="font-bold text-yellow-300">Email:</span>
                          {patient?.email ? (
                            <a href={`mailto:${patient.email}`} className="text-blue-400 ml-1 underline">{patient.email}</a>
                          ) : "N/A"}
                        </p>

                        {/* Action Buttons */}
                        <div className="mt-4 flex flex-wrap gap-4 justify-center">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white transition"
                            onClick={() => toggleRecords(patientId)}
                          >
                            {recordVisibility[patientId] ? "Hide Records" : "View Records"}
                          </button>
                          <button
                            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white transition"
                            onClick={() => handleConsultancy(patient)}
                          >
                            Prescription Consultancy
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white transition"
                            onClick={() => toggleProfile(patientId)}
                          >
                            Close
                          </button>
                        </div>

                        {/* Records Section */}
                        {recordVisibility[patientId] && (
                          <div className="mt-6">
                            <h4 className="text-lg font-bold text-yellow-400">Uploaded Records:</h4>
                            {patientRecords.length > 0 ? (
                              <ul className="space-y-3 mt-2">
                                {patientRecords.map((record, index) => (
                                  <li key={index} className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-lg shadow-inner text-sm">
                                    <span>📄 {record?.fileName ?? "Prescription"}</span>
                                    <div className="flex gap-2">
                                      <a
                                        href={`https://gateway.pinata.cloud/ipfs/${record?.ipfsHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white"
                                      >
                                        View
                                      </a>
                                      {localStorage.getItem("role") === "patient" && (
                                        <button
                                        onClick={() => handleDeleteRecord(patientId, index)}
                                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                                        >
                                          Delete
                                          </button>
                                        )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-400 mt-2">No records uploaded.</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPatientList;
