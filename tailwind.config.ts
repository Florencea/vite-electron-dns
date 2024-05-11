import type { Config } from "tailwindcss";

const config = {
  important: "#root",
  darkMode: "media",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;

export default config;
