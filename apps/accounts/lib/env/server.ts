import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		SESSION_COOKIE_KEY: z.string().default("user_session"),
		JWE_SECRET_KEY: z.string(),
		API_URL: z.string().url(),
	},
	// For Next.js >= 13.4.4, you only need to destructure client variables:
	runtimeEnv: {
		JWE_SECRET_KEY: process.env.JWE_SECRET_KEY,
		API_URL: process.env.API_URL,
		SESSION_COOKIE_KEY: process.env.SESSION_COOKIE_KEY,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
	 * This is especially useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
