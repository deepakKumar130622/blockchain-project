import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import hospitalImage from "./hospital.png";
import { FaUserMd, FaLock, FaCloudUploadAlt } from "react-icons/fa";

const AboutPage = () => {
  const navigate = useNavigate();
  const [showServices, setShowServices] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Our Decentralized EHR System
        </motion.h1>

        <motion.div
          className="glassmorphism p-8 rounded-3xl shadow-xl grid md:grid-cols-2 gap-8 items-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <img
            src={hospitalImage}
            alt="Hospital"
            className="w-full rounded-2xl shadow-lg"
          />

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-lg text-gray-200">
              We're building a secure, transparent, and decentralized health
              record system powered by Ethereum blockchain and IPFS. Patients
              own their data, and doctors and diagnostics centers can only
              access it with explicit permission.
            </p>

            <h2 className="text-2xl font-semibold">Security & Integrity</h2>
            <p className="text-lg text-gray-200">
              All records are encrypted and stored on IPFS, while smart
              contracts manage access rights — ensuring trust, transparency,
              and immutability.
            </p>

            <h2 className="text-2xl font-semibold">What We Do</h2>
            <p className="text-lg text-gray-200">
              We provide a decentralized platform for managing Electronic Health
              Records (EHRs) using Ethereum blockchain and IPFS. Our system enables
              patients to securely upload and control access to their medical data,
              while allowing doctors and diagnostic centers to access information
              only when granted explicit permission via smart contracts.
            </p>

            <div className="flex flex-wrap gap-4">
              {!showServices && (
                <button
                  onClick={() => setShowServices(true)}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full transition duration-300"
                >
                  View Services
                </button>
              )}
              <button
                onClick={() => navigate("/")}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-2 rounded-full transition duration-300"
              >
                Back to Home Page
              </button>
            </div>
          </div>
        </motion.div>

        {showServices && (
          <motion.div
            className="glassmorphism p-8 rounded-3xl shadow-xl mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold mb-6 text-center">Our Services</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <FaUserMd className="mx-auto text-4xl text-cyan-400" />
                <h3 className="text-xl font-bold">Doctor Access</h3>
                <p className="text-gray-300">
                  Doctors can access records only when patients grant them permission.
                </p>
              </div>
              <div className="space-y-4">
                <FaCloudUploadAlt className="mx-auto text-4xl text-green-400" />
                <h3 className="text-xl font-bold">Secure Upload</h3>
                <p className="text-gray-300">
                  Patients upload encrypted records stored on IPFS.
                </p>
              </div>
              <div className="space-y-4">
                <FaLock className="mx-auto text-4xl text-yellow-400" />
                <h3 className="text-xl font-bold">Data Ownership</h3>
                <p className="text-gray-300">
                  Patients control their data through blockchain-powered smart contracts.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AboutPage;
