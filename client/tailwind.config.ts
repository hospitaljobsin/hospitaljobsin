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
            secondary: {
              50: "#f5f5f5",
              100: "#ebebeb",
              200: "#cccccc",
              300: "#adadad",
              400: "#707070",
              500: "#333333",
              600: "#2e2e2e",
              700: "#1f1f1f",
              800: "#171717",
              900: "#0f0f0f",
              foreground: "white",
              DEFAULT: "#333333",
            },
          },
        },
      },
    }),
    typography,
  ],
} satisfies Config;
