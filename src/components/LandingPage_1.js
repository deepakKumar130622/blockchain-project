import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "./NavBar";

import lp_1 from "./lp_1.jpg";
import lp_2 from "./lp_2.jpg";
import lp_3 from "./lp_3.jpg";

const images = [lp_1, lp_2, lp_3];

function LandingPage() {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative font-[Times_New_Roman] min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute inset-0 w-full h-full animate-[pulse_10s_infinite] bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,255,0.05),transparent_50%),_radial-gradient(circle_at_80%_70%,rgba(255,0,255,0.05),transparent_50%)]"></div>
        <div className="animate-ping w-6 h-6 bg-cyan-300 rounded-full absolute top-12 left-12 opacity-20 blur-2xl" />
        <div className="animate-bounce w-5 h-5 bg-emerald-400 rounded-full absolute bottom-32 right-24 opacity-20 blur-xl" />
        <div className="animate-float w-4 h-4 bg-indigo-400 rounded-full absolute top-1/3 left-1/4 opacity-25 blur-md" />
        <div className="animate-float w-4 h-4 bg-pink-400 rounded-full absolute top-1/4 right-1/4 opacity-20 blur-lg" />
      </div>

      {/* Wave SVG */}
      <svg
        className="absolute bottom-0 w-full h-56 z-0"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#2563eb"
          fillOpacity="0.3"
          d="M0,64L60,96C120,128,240,192,360,186.7C480,181,600,107,720,96C840,85,960,139,1080,165.3C1200,192,1320,192,1380,192L1440,192V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z"
        />
      </svg>

      <NavBar />

      {/* Main Content Section */}
      <div className="flex justify-center items-center px-6 pt-32 pb-24 relative z-10">
        <div className="w-[1400px] h-[450px] flex gap-6">
          {/* Slideshow */}
          <div className="w-3/5 relative overflow-hidden rounded-2xl shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={imageIndex}
                src={images[imageIndex]}
                alt="EHR visual"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>

          {/* Description Box */}
          <div className="w-2/5 h-[450px] bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-2xl shadow-xl flex items-center">
            <p className="text-lg leading-relaxed text-gray-100">
              The Secure Electronic Health Records App is revolutionizing EHR
              management by leveraging blockchain technology. Utilizing key
              components such as blockchain for secure and transparent data
              storage, Ganache for rapid development, Metamask for seamless
              blockchain interaction, and IPFS for decentralized file storage —
              it ensures enhanced security, accessibility, interoperability, and
              trust. This innovation transforms healthcare data management for
              better patient outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
