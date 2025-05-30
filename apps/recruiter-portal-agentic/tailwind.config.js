/** @type {import('tailwindcss').Config} */

module.exports = {
	theme: {
		extend: {
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
};
