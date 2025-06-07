import { createEnv } from "@t3-oss/env-core";
import "dotenv/config";
import { z } from "zod";

export const env = createEnv({
	server: {
		API_BASE_URL: z.string().url(),
		ACCOUNTS_UI_BASE_URL: z.string().url(),
		SEEKER_PORTAL_BASE_URL: z.string().url(),
		MAILCATCHER_BASE_URL: z.string().url(),
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
	},
});
