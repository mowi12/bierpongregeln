import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Bierpongregeln brand colors based on logo
        primary: {
          50: "#e6f7f6",
          100: "#b3e8e6",
          200: "#80d9d6",
          300: "#4dcac6",
          400: "#1abbb6",
          500: "#00b3aa", // Main teal from logo
          600: "#009a92",
          700: "#00817a",
          800: "#006862",
          900: "#004f4a",
        },
        secondary: {
          50: "#fff5f4",
          100: "#ffe6e4",
          200: "#ffd3d0",
          300: "#ffc0bc",
          400: "#ffada8",
          500: "#ff786e", // Light red from logo
          600: "#ff5a4e",
          700: "#ff3c2e",
          800: "#ff1e0e",
          900: "#e60000",
        },
        accent: {
          50: "#fef7f5",
          100: "#fdeeea",
          200: "#fbe5e0",
          300: "#f9dcd6",
          400: "#f7d3cc",
          500: "#be5652", // Dark red from logo
          600: "#a84a47",
          700: "#923e3c",
          800: "#7c3231",
          900: "#662626",
        },
        neutral: {
          50: "#fefaf9",
          100: "#fdf5f3",
          200: "#fcefea",
          300: "#fbe9e1",
          400: "#fae3d8",
          500: "#efeae0", // Light gray from logo
          600: "#e6d9cc",
          700: "#dcc8b8",
          800: "#d2b7a4",
          900: "#c8a690",
        },
        surface: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "bierpong-gradient":
          "linear-gradient(135deg, #00b3aa 0%, #018273 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
