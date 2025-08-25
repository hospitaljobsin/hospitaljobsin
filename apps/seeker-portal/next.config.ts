import createMDX from "@next/mdx";
import { withSentryConfig } from "@sentry/nextjs";
import { createJiti } from "jiti";
import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { env } from "./lib/env/client";

const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti.esmResolve("./lib/env/client");

const nextConfig: NextConfig = {
	/* config options here */
	poweredByHeader: false,
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	experimental: {
		mdxRs: true,
		reactCompiler: true,
	},
	reactStrictMode: true,
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
		relay: {
			src: "./",
			language: "typescript",
			artifactDirectory: "__generated__",
		},
	},
	allowedDevOrigins: ["localtest.me"],
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		loader: "default",
		unoptimized: false,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			// TODO: allow this only in dev/testing mode
			{
				protocol: "http",
				hostname: "localhost",
			},
		],
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
				],
			},
			// {
			// 	source: "/sw.js",
			// 	headers: [
			// 		{
			// 			key: "Content-Type",
			// 			value: "application/javascript; charset=utf-8",
			// 		},
			// 		{
			// 			key: "Cache-Control",
			// 			value: "no-cache, no-store, must-revalidate",
			// 		},
			// 		{
			// 			key: "Content-Security-Policy",
			// 			value: "default-src 'self'; script-src 'self'",
			// 		},
			// 	],
			// },
		];
	},
};

const withMDX = createMDX({
	// Add markdown plugins here, as desired
});

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

// Merge MDX config with Next.js config
export default withBundleAnalyzer(
	withSentryConfig(withMDX(nextConfig), {
		// For all available options, see:
		// https://www.npmjs.com/package/@sentry/webpack-plugin#options

		org: env.NEXT_PUBLIC_SENTRY_ORGANIZATION,
		project: env.NEXT_PUBLIC_SENTRY_PROJECT,

		// Only print logs for uploading source maps in CI
		silent: !process.env.CI,

		// For all available options, see:
		// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

		// Upload a larger set of source maps for prettier stack traces (increases build time)
		widenClientFileUpload: true,

		// Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
		// This can increase your server load as well as your hosting bill.
		// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
		// side errors will fail.
		// tunnelRoute: "/monitoring",

		// Automatically tree-shake Sentry logger statements to reduce bundle size
		disableLogger: true,

		// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
		// See the following for more information:
		// https://docs.sentry.io/product/crons/
		// https://vercel.com/docs/cron-jobs
		automaticVercelMonitors: true,
	}),
);
