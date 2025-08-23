import { createEnv } from "@t3-oss/env-core";
import "dotenv/config";
import { z } from "zod";

export const env = createEnv({
	server: {
		API_BASE_URL: z.string().url(),
		ACCOUNTS_UI_BASE_URL: z.string().url(),
		SEEKER_PORTAL_BASE_URL: z.string().url(),
		MAILCATCHER_BASE_URL: z.string().url().default("http://localhost:1080"),
		ENVIRONMENT: z.enum(["staging", "testing"]),
		// Mailinator configuration for staging environment (free tier public inboxes)
		MAILINATOR_API_KEY: z.string().optional(),
		MAILINATOR_PRIVATE_DOMAIN: z.string().optional(),
		MAILINATOR_BASE_URL: z.string().url().default("https://api.mailinator.com"),
		BASIC_AUTH_USERNAME: z.string().optional(),
		BASIC_AUTH_PASSWORD: z.string().optional(),
		PLAYWRIGHT_SHARD: z.string().default("1"),
	},

	/**
	 * What object holds the environment variables at runtime. This is usually
	 * `process.env` or `import.meta.env`.
	 */
	runtimeEnvStrict: {
		API_BASE_URL: process.env.API_BASE_URL,
		ACCOUNTS_UI_BASE_URL: process.env.ACCOUNTS_UI_BASE_URL,
		SEEKER_PORTAL_BASE_URL: process.env.SEEKER_PORTAL_BASE_URL,
		MAILCATCHER_BASE_URL: process.env.MAILCATCHER_BASE_URL,
		ENVIRONMENT: process.env.ENVIRONMENT,
		MAILINATOR_API_KEY: process.env.MAILINATOR_API_KEY,
		MAILINATOR_PRIVATE_DOMAIN: process.env.MAILINATOR_PRIVATE_DOMAIN,
		MAILINATOR_BASE_URL: process.env.MAILINATOR_BASE_URL,
		BASIC_AUTH_USERNAME: process.env.BASIC_AUTH_USERNAME,
		BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD,
		PLAYWRIGHT_SHARD: process.env.PLAYWRIGHT_SHARD,
	},
});
