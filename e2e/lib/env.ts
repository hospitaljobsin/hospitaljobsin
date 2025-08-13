import { createEnv } from "@t3-oss/env-core";
import "dotenv/config";
import { z } from "zod";

export const env = createEnv({
	server: {
		API_BASE_URL: z.string().url(),
		ACCOUNTS_UI_BASE_URL: z.string().url(),
		SEEKER_PORTAL_BASE_URL: z.string().url(),
		MAILCATCHER_BASE_URL: z.string().url(),
		ENVIRONMENT: z.enum(["staging", "testing"]),
		// AWS Lambda configuration for test database setup
		STAGING_DB_SETUP_LAMBDA_FUNCTION_ARN: z.string().optional(),
		STAGING_DB_TEARDOWN_LAMBDA_FUNCTION_ARN: z.string().optional(),
		AWS_REGION: z.string().default("us-east-1"),
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
		STAGING_DB_SETUP_LAMBDA_FUNCTION_ARN:
			process.env.STAGING_DB_SETUP_LAMBDA_FUNCTION_ARN,
		STAGING_DB_TEARDOWN_LAMBDA_FUNCTION_ARN:
			process.env.STAGING_DB_TEARDOWN_LAMBDA_FUNCTION_ARN,
		AWS_REGION: process.env.AWS_REGION,
	},
});
