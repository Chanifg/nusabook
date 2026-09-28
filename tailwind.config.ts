import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e3f2fd",
          100: "#bbdefb",
          500: "#1976d2",
          700: "#0d47a1", // Biru Samudra
          900: "#0a2d6c",
        },
        accent: {
          50: "#fff3e0",
          500: "#f57c00", // Oranye Senja
          600: "#e65100",
        },
      },
    },
  },
  plugins: [],
};
export default config;
