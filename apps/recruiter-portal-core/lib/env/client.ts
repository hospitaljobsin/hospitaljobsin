import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4-mini";

export const env = createEnv({
	client: {
		NEXT_PUBLIC_URL: z.url(),
		NEXT_PUBLIC_API_URL: z.url(),
		NEXT_PUBLIC_ACCOUNTS_BASE_URL: z.url(),
		NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL: z.url(),
		NEXT_PUBLIC_SESSION_COOKIE_KEY: z.string(),
		NEXT_PUBLIC_SENTRY_DSN: z.string(),
		NEXT_PUBLIC_SENTRY_ORGANIZATION: z.string(),
		NEXT_PUBLIC_SENTRY_PROJECT: z.string(),
		NEXT_PUBLIC_ENVIRONMENT: z.enum(["development", "testing", "production"]),
		NEXT_PUBLIC_ROOT_DOMAIN: z.string(),
	},
	// For Next.js >= 13.4.4, you only need to destructure client variables:
	runtimeEnv: {
		NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_ACCOUNTS_BASE_URL: process.env.NEXT_PUBLIC_ACCOUNTS_BASE_URL,
		NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL:
			process.env.NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL,
		NEXT_PUBLIC_SESSION_COOKIE_KEY: process.env.NEXT_PUBLIC_SESSION_COOKIE_KEY,
		NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
		NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
		NEXT_PUBLIC_SENTRY_ORGANIZATION:
			process.env.NEXT_PUBLIC_SENTRY_ORGANIZATION,
		NEXT_PUBLIC_SENTRY_PROJECT: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
		NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
	 * This is especially useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
