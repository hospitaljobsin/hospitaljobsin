import { nextui } from "@nextui-org/react";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Work Sans", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui(), typography],
} satisfies Config;
