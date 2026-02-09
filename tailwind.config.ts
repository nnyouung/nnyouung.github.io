import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 40px -28px rgba(15, 23, 42, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
