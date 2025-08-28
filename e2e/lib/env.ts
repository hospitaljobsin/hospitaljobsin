import { createEnv } from "@t3-oss/env-core";
import "dotenv/config";
import { z } from "zod";

export const env = createEnv({
	server: {
		API_BASE_URL: z.string().url(),
		ACCOUNTS_UI_BASE_URL: z.string().url(),
		RP_ID: z.string().default("localtest.me"),
		SEEKER_PORTAL_BASE_URL: z.string().url(),
		ENVIRONMENT: z.enum(["staging", "testing"]),
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
		RP_ID: process.env.RP_ID,
		SEEKER_PORTAL_BASE_URL: process.env.SEEKER_PORTAL_BASE_URL,
		ENVIRONMENT: process.env.ENVIRONMENT,
		BASIC_AUTH_USERNAME: process.env.BASIC_AUTH_USERNAME,
		BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD,
		PLAYWRIGHT_SHARD: process.env.PLAYWRIGHT_SHARD,
	},
});
