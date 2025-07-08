// hero.ts
import { heroui } from "@heroui/react";
export default heroui({
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
});
