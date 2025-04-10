import { heroui } from "@heroui/react";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Work Sans", "sans-serif"],
			},
			typography: () => ({
				foreground: {
					css: {
						h1: {
							"font-weight": "600",
						},
						h2: {
							"font-weight": "500",
						},
						h3: {
							"font-weight": "500",
						},
						"--tw-prose-body": "hsl(var(--heroui-foreground-500))",
						"--tw-prose-headings": "hsl(var(--heroui-foreground-600))",
						"--tw-prose-lead": "hsl(var(--heroui-foreground-600))",
						"--tw-prose-links": "hsl(var(--heroui-primary-400))",
						"--tw-prose-bold": "hsl(var(--heroui-foreground-700))",
						"--tw-prose-counters": "hsl(var(--heroui-foreground-600))",
						"--tw-prose-bullets": "hsl(var(--heroui-foreground-400))",
						"--tw-prose-hr": "hsl(var(--heroui-foreground-300))",
						"--tw-prose-quotes": "hsl(var(--heroui-foreground-600))",
						"--tw-prose-quote-borders": "hsl(var(--heroui-foreground-300))",
						"--tw-prose-captions": "hsl(var(--heroui-foreground-400))",
						"--tw-prose-code": "hsl(var(--heroui-foreground-900))",
						"--tw-prose-pre-code": "hsl(var(--heroui-foreground-100))",
						"--tw-prose-pre-bg": "hsl(var(--heroui-foreground-900))",
						"--tw-prose-th-borders": "hsl(var(--heroui-foreground-300))",
						"--tw-prose-td-borders": "hsl(var(--heroui-foreground-200))",
						"--tw-prose-invert-body": "hsl(var(--heroui-foreground-200))",
						"--tw-prose-invert-headings": "hsl(var(--heroui-white))",
						"--tw-prose-invert-lead": "hsl(var(--heroui-foreground-300))",
						"--tw-prose-invert-links": "hsl(var(--heroui-white))",
						"--tw-prose-invert-bold": "hsl(var(--heroui-white))",
						"--tw-prose-invert-counters": "hsl(var(--heroui-foreground-400))",
						"--tw-prose-invert-bullets": "hsl(var(--heroui-foreground-600))",
						"--tw-prose-invert-hr": "hsl(var(--heroui-foreground-700))",
						"--tw-prose-invert-quotes": "hsl(var(--heroui-foreground-100))",
						"--tw-prose-invert-quote-borders":
							"hsl(var(--heroui-foreground-700))",
						"--tw-prose-invert-captions": "hsl(var(--heroui-foreground-400))",
						"--tw-prose-invert-code": "hsl(var(--heroui-white))",
						"--tw-prose-invert-pre-code": "hsl(var(--heroui-foreground-300))",
						"--tw-prose-invert-pre-bg": "rgb((0 0 0 / 50%))",
						"--tw-prose-invert-th-borders": "hsl(var(--heroui-foreground-600))",
						"--tw-prose-invert-td-borders": "hsl(var(--heroui-foreground-700))",
					},
				},
			}),
		},
	},
	darkMode: "class",
	plugins: [
		heroui({
			layout: {},
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
						background: {
							DEFAULT: "#ffffff",
							100: "#fefefe",
							200: "#fcfcfc",
							300: "#fafafa",
							400: "#f8f8f8",
							500: "#f6f6f6",
							600: "#f4f4f4",
							700: "#e8e8e8",
							800: "#e0e0e0",
						},
					},
				},
			},
		}),
		typography,
	],
} satisfies Config;
