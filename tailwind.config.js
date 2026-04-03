/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-teal": "#00adb5",
        "custom-blue": "#CDF5FD",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out",
        "rotate-3d": "rotate3d 10s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        rotate3d: {
          "0%": {
            transform: "rotateY(0deg) rotateX(0deg)",
          },
          "100%": {
            transform: "rotateY(360deg) rotateX(360deg)",
          },
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
