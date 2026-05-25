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
        // v3 warm neutrals
        ink: {
          DEFAULT: "#241E1A",
          2: "#3D332C"
        },
        brown: {
          DEFAULT: "#6E4A39",
          soft: "#8A6B5C",
          mute: "#9A8B7D"
        },
        hair: {
          DEFAULT: "#E8DECF",
          soft: "#F0E7D7"
        },
        bg: {
          DEFAULT: "#FAF6EE",
          deep: "#F6EDDB",
          surface: "#FFFBF2"
        },
        // v3 pastel blocks
        lime: { DEFAULT: "#D8E0A6" },
        lilac: { DEFAULT: "#D9D0E5" },
        mint: { DEFAULT: "#CDDCC8" },
        peach: { DEFAULT: "#F6D6BD" },
        blush: { DEFAULT: "#F1D6CC" },
        "cream-block": { DEFAULT: "#F1E5C8" },
        // legacy aliases kept for compatibility
        cream: {
          50: "#FFFBF2",
          100: "#FAF6EE",
          200: "#F6EDDB",
          300: "#F0E7D7"
        },
        cocoa: {
          900: "#241E1A",
          700: "#3D332C",
          500: "#8A6B5C",
          400: "#6E4A39"
        }
      },
      boxShadow: {
        soft: "0 10px 24px rgba(36,30,26,0.06)",
        card: "0 1px 4px rgba(36,30,26,0.07)",
        phone: "0 22px 60px rgba(36,30,26,0.18)"
      },
      borderRadius: {
        app: "24px",
        phone: "34px",
        pill: "999px"
      },
      letterSpacing: {
        tight: "-0.022em",
        tighter: "-0.03em",
        tightest: "-0.035em"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
