import { loadSecrets } from "@/lib/secrets";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4-mini";

export function createServerEnv(): Readonly<{
	JWE_SECRET_KEY: string;
	GOOGLE_API_KEY: string;
	GOOGLE_GEMINI_MODEL: string;
	API_URL: string;
}> {
	return createEnv({
		server: {
			JWE_SECRET_KEY: z.string(),
			GOOGLE_API_KEY: z.string(),
			GOOGLE_GEMINI_MODEL: z.string(),
			API_URL: z.url(),
		},
		runtimeEnv: {
			GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
			GOOGLE_GEMINI_MODEL: process.env.GOOGLE_GEMINI_MODEL,
			JWE_SECRET_KEY: process.env.JWE_SECRET_KEY,
			API_URL: process.env.API_URL,
		},
		skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	});
}

let _env: ReturnType<typeof createServerEnv>;

export async function getEnv() {
	if (!_env) {
		await loadSecrets();
		_env = createServerEnv();
	}
	return _env;
}
