import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	client: {
		NEXT_PUBLIC_URL: z.string().url(),
		NEXT_PUBLIC_API_URL: z.string().url(),
		NEXT_PUBLIC_CAPTCHA_SITE_KEY: z.string(),
		NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL: z.string().url(),
		NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL: z.string().url(),
		NEXT_PUBLIC_SESSION_COOKIE_KEY: z.string(),
		NEXT_PUBLIC_SENTRY_DSN: z.string(),
		NEXT_PUBLIC_SENTRY_ORGANIZATION: z.string(),
		NEXT_PUBLIC_SENTRY_PROJECT: z.string(),
		NEXT_PUBLIC_ENVIRONMENT: z.enum(["development", "testing", "production"]),
	},
	// For Next.js >= 13.4.4, you only need to destructure client variables:
	runtimeEnv: {
		NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_CAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY,
		NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL:
			process.env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL,
		NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL:
			process.env.NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL,
		NEXT_PUBLIC_SESSION_COOKIE_KEY: process.env.NEXT_PUBLIC_SESSION_COOKIE_KEY,
		NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
		NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
		NEXT_PUBLIC_SENTRY_ORGANIZATION:
			process.env.NEXT_PUBLIC_SENTRY_ORGANIZATION,
		NEXT_PUBLIC_SENTRY_PROJECT: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
	 * This is especially useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
