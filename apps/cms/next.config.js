import bundleAnalyzer from '@next/bundle-analyzer';
import { withPayload } from '@payloadcms/next/withPayload';
import { withSentryConfig } from '@sentry/nextjs';

import redirects from './redirects.js';

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
	: undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000';

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map(item => {
				const url = new URL(item);

				return {
					hostname: url.hostname,
					protocol: url.protocol.replace(':', '')
				};
			}),
			{
				protocol: 'https',
				hostname: '**.amazonaws.com'
			},
			{
				protocol: 'https',
				hostname: '**.s3.*.amazonaws.com'
			},
			{
				protocol: 'https',
				hostname: '**.s3.amazonaws.com'
			}
		]
	},
	allowedDevOrigins: ['content.localtest.me'],
	webpack: webpackConfig => {
		webpackConfig.resolve.extensionAlias = {
			'.cjs': ['.cts', '.cjs'],
			'.js': ['.ts', '.tsx', '.js', '.jsx'],
			'.mjs': ['.mts', '.mjs']
		};

		return webpackConfig;
	},
	reactStrictMode: true,
	redirects,
	typescript: {
		ignoreBuildErrors: true
	}
};

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true'
});

export default withPayload(
	withBundleAnalyzer(
		withSentryConfig(nextConfig, {
			// For all available options, see:
			// https://www.npmjs.com/package/@sentry/webpack-plugin#options

			org: process.env.NEXT_PUBLIC_SENTRY_ORGANIZATION,
			project: process.env.NEXT_PUBLIC_SENTRY_PROJECT,

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
			automaticVercelMonitors: true
		})
	),
	{ devBundleServerPackages: false }
);
