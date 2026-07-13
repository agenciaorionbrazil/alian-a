import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#7A2348",
          "primary-hover": "#641B3A",
          secondary: "#A94E70",
          soft: "#E8BFCF"
        },
        background: {
          soft: "#F9EEF2",
          main: "#FFFDFC"
        },
        surface: "#FFFFFF",
        text: {
          primary: "#241D21",
          secondary: "#71666B"
        },
        divider: "#EDE4E8",
        success: "#58705A",
        danger: "#A53F4C"
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 12px 32px rgba(36, 29, 33, 0.08)",
        focus: "0 0 0 3px rgba(122, 35, 72, 0.18)"
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem"
      }
    }
  },
  plugins: []
};

export default config;
