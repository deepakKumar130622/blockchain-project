import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./EHR.png";

const NavBar = () => {
  const navigate = useNavigate();

  const linkStyle =
    "relative inline-block text-white font-medium text-lg px-2 py-1 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-full cursor-pointer";

  return (
    <nav className="bg-black text-white h-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 sm:py-0">
          {/* Logo */}
          <div className="shrink-0">
            <img
              className="h-16 w-auto my-[17px] cursor-pointer"
              src={logo}
              alt="Logo"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Title */}
          <div className="mt-4 sm:mt-0 sm:ml-10 text-center">
            <span
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold cursor-pointer"
              onClick={() => navigate("/")}
            >
              Secure Electronic Health Records
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row sm:space-x-6 mt-4 sm:mt-0 text-lg">
            <span className={linkStyle} onClick={() => navigate("/")}>
              Home
            </span>
            <span className={linkStyle} onClick={() => navigate("/AboutPage")}>
              About Us
            </span>
            <span className={linkStyle} onClick={() => navigate("/register")}>
              Register
            </span>
            <span className={linkStyle} onClick={() => navigate("/login")}>
              Login
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
