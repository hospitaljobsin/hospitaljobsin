import { createEnv } from "@t3-oss/env-nextjs";
import "server-only";
import { z } from "zod/v4-mini";

export const serverEnv = createEnv({
	server: {
		JWE_SECRET_KEY: z.string(),
	},
	runtimeEnv: {
		JWE_SECRET_KEY: process.env.JWE_SECRET_KEY,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
