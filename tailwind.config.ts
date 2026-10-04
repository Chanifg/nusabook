import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#e3f2fd",
          100: "#bbdefb",
          500: "#1976d2",
          700: "#0d47a1", // Biru Samudra
          800: "#003566",
          900: "#002041",
        },
        accent: {
          50: "#fff3e0",
          100: "#ffddb4",
          500: "#f57c00", // Oranye Senja
          600: "#e65100",
          700: "#835500",
        },
        surface: {
          DEFAULT: "#f8f9ff",
          dim: "#ccdbf4",
          bright: "#f8f9ff",
          container: {
            lowest: "#ffffff",
            low: "#eff4ff",
            DEFAULT: "#e6eeff",
            high: "#dde9ff",
            highest: "#d5e3fd",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;

