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
        share: {
          navy: "#0A1628",
          blue: "#1E3A8A",
          sky: "#3B82F6",
          gold: "#F59E0B",
          success: "#10B981",
          error: "#EF4444",
          surface: "#FFFFFF",
          muted: "#6B7280",
        },
      },
      keyframes: {
        "check-draw": {
          "0%": { "stroke-dashoffset": "100" },
          "100%": { "stroke-dashoffset": "0" },
        },
        "scale-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "60%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "check-draw": "check-draw 0.5s ease-out forwards",
        "scale-in": "scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "fade-in-up": "fade-in-up 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
