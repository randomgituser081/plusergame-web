import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        red: { DEFAULT: "#9A2121" },
        yellow: { DEFAULT: "#D4AF37" },
        charcoal: { DEFAULT: "#0F1115", light: "#1B1F27" },
        gray: { DEFAULT: "#9CA3AF", light: "#F5F7FA" },
        green: { DEFAULT: "#22C55E" },
      },
      fontFamily: {
        mthin: ["var(--font-montserrat)", "sans-serif"],
        mlight: ["var(--font-montserrat)", "sans-serif"],
        mregular: ["var(--font-montserrat)", "sans-serif"],
        mmedium: ["var(--font-montserrat)", "sans-serif"],
        mbold: ["var(--font-montserrat)", "sans-serif"],
        msbold: ["var(--font-montserrat)", "sans-serif"],
        mblack: ["var(--font-montserrat)", "sans-serif"],
      },
      animation: {
        "spin-fast": "spin 0.5s linear infinite",
        blink: "blink 1s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 80%, 100%": { opacity: "1" },
          "85%, 95%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
