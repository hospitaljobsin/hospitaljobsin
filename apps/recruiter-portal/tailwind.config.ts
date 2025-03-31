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
						"--tw-prose-body": "var(--heroui-foreground-400)",
						"--tw-prose-headings": "var(--heroui-foreground-300)",
						"--tw-prose-lead": "var(--heroui-foreground-600)",
						"--tw-prose-links": "var(--heroui-primary-400)",
						"--tw-prose-bold": "var(--heroui-foreground-800)",
						"--tw-prose-counters": "var(--heroui-foreground-600)",
						"--tw-prose-bullets": "var(--heroui-foreground-400)",
						"--tw-prose-hr": "var(--heroui-foreground-300)",
						"--tw-prose-quotes": "var(--heroui-foreground-600)",
						"--tw-prose-quote-borders": "var(--heroui-foreground-300)",
						"--tw-prose-captions": "var(--heroui-foreground-400)",
						"--tw-prose-code": "var(--heroui-foreground-900)",
						"--tw-prose-pre-code": "var(--heroui-foreground-100)",
						"--tw-prose-pre-bg": "var(--heroui-foreground-900)",
						"--tw-prose-th-borders": "var(--heroui-foreground-300)",
						"--tw-prose-td-borders": "var(--heroui-foreground-200)",
						"--tw-prose-invert-body": "var(--heroui-foreground-200)",
						"--tw-prose-invert-headings": "var(--heroui-white)",
						"--tw-prose-invert-lead": "var(--heroui-foreground-300)",
						"--tw-prose-invert-links": "var(--heroui-white)",
						"--tw-prose-invert-bold": "var(--heroui-white)",
						"--tw-prose-invert-counters": "var(--heroui-foreground-400)",
						"--tw-prose-invert-bullets": "var(--heroui-foreground-600)",
						"--tw-prose-invert-hr": "var(--heroui-foreground-700)",
						"--tw-prose-invert-quotes": "var(--heroui-foreground-100)",
						"--tw-prose-invert-quote-borders": "var(--heroui-foreground-700)",
						"--tw-prose-invert-captions": "var(--heroui-foreground-400)",
						"--tw-prose-invert-code": "var(--heroui-white)",
						"--tw-prose-invert-pre-code": "var(--heroui-foreground-300)",
						"--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
						"--tw-prose-invert-th-borders": "var(--heroui-foreground-600)",
						"--tw-prose-invert-td-borders": "var(--heroui-foreground-700)",
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
