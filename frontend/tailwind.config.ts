import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0A2540",
          accent: "#5B8DEF",
          accent2: "#8B5CF6",
        },
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #5B8DEF 0%, #8B5CF6 100%)",
        "hero-light":
          "radial-gradient(1200px 500px at 50% -10%, rgba(91,141,239,0.18), transparent 60%)",
        "hero-dark":
          "radial-gradient(1200px 500px at 50% -10%, rgba(139,92,246,0.25), transparent 60%)",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(10,37,64,0.18)",
        glow: "0 0 0 1px rgba(91,141,239,0.25), 0 12px 40px -8px rgba(91,141,239,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
