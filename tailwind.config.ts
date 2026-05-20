import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFF8F0",
          100: "#FBF6F0",
          200: "#F5E8DC",
          300: "#F0E4D8"
        },
        cocoa: {
          900: "#3D2419",
          700: "#5F4534",
          500: "#8A6B5C",
          400: "#B07A5C"
        },
        coral: {
          300: "#FFB088",
          400: "#FF8A65",
          500: "#E07856",
          800: "#8A3E25"
        },
        leaf: {
          100: "#E8F3E5",
          300: "#A8D5A8",
          500: "#7AB87A",
          800: "#3A6B3A",
          900: "#1F4A1F"
        },
        sky: {
          100: "#E0EDF5",
          300: "#B8D4E5",
          500: "#7DA8C8",
          800: "#2C5A7A",
          900: "#1A3A55"
        },
        honey: {
          100: "#FFF1DA",
          400: "#E8A04E",
          800: "#7A5A1A"
        }
      },
      boxShadow: {
        soft: "0 10px 24px rgba(61, 36, 25, 0.08)",
        card: "0 2px 10px rgba(61, 36, 25, 0.05)",
        phone: "0 22px 60px rgba(44, 36, 32, 0.22)"
      },
      borderRadius: {
        app: "22px",
        phone: "30px"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
