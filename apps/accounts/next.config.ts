import MillionLint from "@million/lint";
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
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	typedRoutes: true,
	poweredByHeader: false,
	reactStrictMode: true,
	experimental: {
		reactCompiler: true,
	},
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
		relay: {
			src: "./",
			language: "typescript",
			artifactDirectory: "__generated__",
		},
	},
	allowedDevOrigins: ["accounts.localtest.me"],
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		loader: "default",
		unoptimized: false,
		formats: ["image/webp", "image/avif"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 86400, // 1 day (more reasonable for user content)
		dangerouslyAllowSVG: true,
		contentDispositionType: "attachment",
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.amazonaws.com",
			},
			{
				protocol: "https",
				hostname: "**.s3.*.amazonaws.com",
			},
			{
				protocol: "https",
				hostname: "**.s3.amazonaws.com",
			},
			{
				protocol: "https",
				hostname: "api.dicebear.com",
			},
			{
				protocol: "https",
				hostname: env.NEXT_PUBLIC_ROOT_DOMAIN,
			},
			...(env.NEXT_PUBLIC_ENVIRONMENT === "development"
				? [
						{
							protocol: "http" as const,
							hostname: "localhost",
							port: "9000",
						},
					]
				: []),
		],
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/settings",
				permanent: true,
			},
		];
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
			{
				source: "/_next/image(.*)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=604800", // 7 days for user-generated images
					},
				],
			},
			{
				source: "/_next/static/media/(.*)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
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

export default withSentryConfig(MillionLint.next({ rsc: true })(nextConfig), {
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
});
