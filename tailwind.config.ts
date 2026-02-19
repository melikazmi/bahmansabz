import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: "#41BA89",
        accent: "#E3AC38",
      },
      fontFamily: {
        vazir: ["Vazir", "Vazirmatn", "Tahoma", "sans-serif"],
      },
    },
  },
};

export default config;
