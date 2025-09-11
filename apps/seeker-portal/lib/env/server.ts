import { createEnv } from '@t3-oss/env-nextjs';
import 'server-only';
import { z } from 'zod/v4-mini';

export const serverEnv = createEnv({
	server: {
		JWE_SECRET_KEY: z.string(),
		REVALIDATE_SECRET: z.string()
	},
	runtimeEnv: {
		JWE_SECRET_KEY: process.env.JWE_SECRET_KEY,
		REVALIDATE_SECRET: process.env.REVALIDATE_SECRET
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION
});
