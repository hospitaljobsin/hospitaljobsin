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
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#f3faf4",
              100: "#e6f5e9",
              200: "#c0e6c8",
              300: "#9ad7a7",
              400: "#4db866",
              500: "#00a925",
              600: "#009822",
              700: "#006614",
              800: "#004d0f",
              900: "#00340a",
              foreground: "white",
              DEFAULT: "#00a925",
            },
          },
        },
      },
    }),
    typography,
  ],
} satisfies Config;
