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
        accent:  "#00D4FF",
        violet:  "#7C3AED",
        green:   "#00FF94",
        orange:  "#FF8A3D",
        red:     "#FF5E7A",
      },
      fontFamily: {
        head:  ["Outfit", "sans-serif"],
        serif: ["DM Serif Display", "serif"],
        mono:  ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
