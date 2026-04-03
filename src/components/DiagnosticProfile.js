import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";

const DiagnosticProfile = () => {
  const { diagnosticId } = useParams(); // Get the diagnostic center ID from URL params
  const navigate = useNavigate();
  const [diagnosticDetails, setDiagnosticDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const storedDetails = JSON.parse(localStorage.getItem("diagnosticDetails"));
      if (storedDetails && storedDetails[diagnosticId]) {
        setDiagnosticDetails(storedDetails[diagnosticId]);
      } else {
        setError("❌ Diagnostic center details not found in localStorage.");
      }
    } catch (e) {
      console.error("❌ Failed to load diagnostic details from localStorage:", e);
      setError("Failed to load diagnostic details.");
    }
  }, [diagnosticId]);

  const cancelOperation = () => navigate(`/diagnostic/${diagnosticId}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white font-sans tracking-wide">
      <NavBar_Logout />
      <div className="flex justify-center items-center px-4 py-16">
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 shadow-2xl transition-all duration-300 animate-fade-in">
          <h2 className="text-4xl font-bold text-center text-cyan-400 mb-10 drop-shadow-md">
            🏥 Diagnostic Center's Profile
          </h2>

          {error ? (
            <p className="text-red-500 text-center font-semibold">{error}</p>
          ) : diagnosticDetails ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base sm:text-lg">
              <ProfileLine label="Name" value={diagnosticDetails.name || "N/A"} />
              <ProfileLine label="Location" value={diagnosticDetails.location || "N/A"} />
              <ProfileLine label="Email-Id" value={diagnosticDetails.email || "N/A"} />
              <ProfileLine label="Phone" value={diagnosticDetails.phone || "N/A"} />
              <ProfileLine label="Authorized Doctors" value={diagnosticDetails.authorizedDoctors || "N/A"} />
              <ProfileLine label="Diagnostic ID" value={diagnosticId} />
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

export default DiagnosticProfile;
