import React, { useState } from "react";
import { uploadToPinata } from "../pinataUpload";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import { UploadCloud, Loader2, CheckCircle2, XCircle } from "lucide-react";
import NavBar_Logout from "./NavBar_Logout";

const UploadRecords = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      setError("No file selected.");
      return;
    }
    setFile(selectedFile);
    setError("");
    setSuccess(false);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      setUploading(true);
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const transaction = {
          from: accounts[0],
          to: accounts[0], // Use sender's own address for testing
          value: web3.utils.toWei("0.001", "ether"),
        };

        try {
          await web3.eth.sendTransaction(transaction);
        } catch (txError) {
          setError("Transaction failed: " + (txError.message || txError));
          setUploading(false);
          return;
        }

        const cid = await uploadToPinata(file);
        if (cid) {
          saveRecordToLocalStorage(hhNumber, file.name, cid);
          setSuccess(true);
          setFile(null);
          setError("");
          window.dispatchEvent(new Event("storage"));
        } else {
          setError("❌ File upload failed. Try again.");
        }
      } else {
        setError("❌ MetaMask is not installed.");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      setError("Upload error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const saveRecordToLocalStorage = (patientId, fileName, ipfsHash) => {
    let storedRecords = JSON.parse(localStorage.getItem("records")) || {};

    if (!storedRecords[patientId]) {
      storedRecords[patientId] = [];
    }

    storedRecords[patientId].push({
      fileName,
      ipfsHash,
      uploadedAt: new Date().toISOString(),
    });

    localStorage.setItem("records", JSON.stringify(storedRecords));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-slate-900 text-white">
      <NavBar_Logout />

      <div className="flex flex-col items-center justify-center px-4 py-20">
        <div className="w-full max-w-xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl animate-fade-in transition-all duration-500 hover:shadow-3xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center bg-gradient-to-r from-yellow-400 to-lime-400 text-transparent bg-clip-text mb-10 drop-shadow-lg">
             Upload Health Records
             </h2>


          <div className="flex flex-col items-center space-y-6">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full cursor-pointer file:px-6 file:py-2 file:rounded-full file:border-0 file:font-semibold file:bg-gradient-to-r file:from-lime-500 file:to-green-500 file:text-white hover:file:from-lime-600 hover:file:to-green-600 text-white bg-white/5 border border-white/10 rounded-xl py-3 px-4 shadow-inner"
            />

            {file && (
              <p className="text-sm text-gray-300 italic">
                Selected: <span className="text-lime-400 font-medium">{file.name}</span>
              </p>
            )}

            {error && (
              <div className="flex items-center text-red-400 font-semibold">
                <XCircle className="mr-2" /> {error}
              </div>
            )}

            {success && (
              <div className="flex items-center text-green-400 font-semibold animate-pulse">
                <CheckCircle2 className="mr-2" /> File uploaded successfully!
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-bold rounded-full shadow-md transition-all duration-300"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud /> Upload
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setFile(null);
                  setError("");
                  setSuccess(false);
                }}
                className="px-6 py-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-full transition"
              >
                Cancel
              </button>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="mt-6 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full font-semibold shadow-md transition"
            >
              ⬅ Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadRecords;
