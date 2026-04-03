import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-800 font-[Times_New_Roman] text-white">
      <NavBar />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md p-10 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl space-y-6 transition-all duration-500">
          <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

          <button
            className="bg-teal-500/80 text-white font-semibold py-3 px-4 rounded-lg w-full transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-600/80"
            onClick={() => navigate("/doctor_registration")}
          >
            Doctor Registration
          </button>

          <button
            className="bg-teal-500/80 text-white font-semibold py-3 px-4 rounded-lg w-full transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-600/80"
            onClick={() => navigate("/patient_registration")}
          >
            Patient Registration
          </button>

          <button
            className="bg-teal-500/80 text-white font-semibold py-3 px-4 rounded-lg w-full transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-600/80"
            onClick={() => navigate("/diagnostic_registration")}
          >
            Diagnostics Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
