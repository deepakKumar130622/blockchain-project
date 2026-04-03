import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Web3 from "web3";
import Footer from "./components/Footer";
import LandingPage_1 from "./components/LandingPage_1";
import AboutUs from "./components/AboutPage"; 
import GrantPermission from "./components/GrantPermission"; 

// ✅ Lazy-loaded Components for Better Performance
const PatientRegistry = lazy(() => import("./components/PatientRegistration"));
const LoginPage = lazy(() => import("./components/LoginPage"));
const PatientDashBoard = lazy(() => import("./components/PatientDashBoard"));
const DoctorDashBoard = lazy(() => import("./components/DoctorDashBoard"));
const DiagnosticDashBoard = lazy(() => import("./components/DiagnosticDashBoard"));
const RegisterPage = lazy(() => import("./components/RegisterPage"));
const DoctorLogin = lazy(() => import("./components/DoctorLogin"));
const DiagnosticLogin = lazy(() => import("./components/DiagnosticLogin"));
const PatientLogin = lazy(() => import("./components/PatientLogin"));
const DiagnosticForm = lazy(() => import("./components/DiagnosticForm"));
const DoctorRegistry = lazy(() => import("./components/DoctorRegistration"));
const DiagnosticRegistry = lazy(() => import("./components/DiagnosticsRegistration"));
const ViewPatientRecords = lazy(() => import("./components/ViewPatientRecords"));
const ViewPatientList = lazy(() => import("./components/ViewPatientList"));
const ViewProfile = lazy(() => import("./components/ViewProfile"));
const ViewDoctorProfile = lazy(() => import("./components/ViewDoctorProfile"));
const ViewDiagnosticProfile = lazy(() => import("./components/ViewDiagnosticProfile"));
const UploadRecords = lazy(() => import("./components/UploadRecords"));
const DoctorForm = lazy(() => import("./components/DoctorForm"));

const BrowseRouter = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          setWeb3(web3Instance);
          const fetchedAccounts = await web3Instance.eth.getAccounts();
          setAccounts(fetchedAccounts);
          console.log("Connected Wallet:", fetchedAccounts[0]);
        } catch (error) {
          console.error("MetaMask connection error:", error);
        }
      } else {
        console.warn("MetaMask not detected. Please install it.");
      }
    };

    if (!web3) {
      initWeb3();
    }
  }, [web3]);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage_1 />} />
          <Route path="/aboutpage" element={<AboutUs />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/patient_registration" element={<PatientRegistry />} />
          <Route path="/doctor_registration" element={<DoctorRegistry />} />
          <Route path="/diagnostic_registration" element={<DiagnosticRegistry />} />
          <Route path="/patient_login" element={<PatientLogin />} />
          <Route path="/doctor_login" element={<DoctorLogin />} />
          <Route path="/diagnostic_login" element={<DiagnosticLogin />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/patient/:hhNumber" element={<PatientDashBoard />} />
          <Route path="/doctor/:hhNumber" element={<DoctorDashBoard />} />
          <Route path="/diagnostic/:hhNumber" element={<DiagnosticDashBoard />} />
          <Route path="/patient/:hhNumber/viewprofile" element={<ViewProfile />} />
          <Route path="/doctor/:hhNumber/viewdoctorprofile" element={<ViewDoctorProfile />} />
          <Route path="/diagnostic/:hhNumber/viewdiagnosticprofile" element={<ViewDiagnosticProfile />} />
          <Route path="/patient/:hhNumber/viewrecords" element={<ViewPatientRecords />} />
          <Route path="/doctor/:hhNumber/patientlist" element={<ViewPatientList />} />
          <Route path="/diagnostic/:hhNumber/diagnosticform" element={<DiagnosticForm />} />
          <Route path="/patient/:hhNumber/uploadrecords" element={<UploadRecords />} />
          <Route path="/patient/:hhNumber/grantaccess" element={<GrantPermission />} />
          <Route path="/doctor/:hhNumber/doctorform" element={<DoctorForm />} /> {/* ✅ Added missing route */}
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
};

export default BrowseRouter;
