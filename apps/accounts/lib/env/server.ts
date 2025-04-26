// env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { loadSecrets } from "../secrets";

export function createServerEnv(): Readonly<{
	SESSION_COOKIE_KEY: string;
	JWE_SECRET_KEY: string;
	API_URL: string;
}> {
	return createEnv({
		server: {
			SESSION_COOKIE_KEY: z.string().default("user_session"),
			JWE_SECRET_KEY: z.string(),
			API_URL: z.string().url(),
		},
		runtimeEnv: {
			JWE_SECRET_KEY: process.env.JWE_SECRET_KEY,
			API_URL: process.env.API_URL,
			SESSION_COOKIE_KEY: process.env.SESSION_COOKIE_KEY,
		},
		skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	});
}

export let env: ReturnType<typeof createServerEnv>;

export async function initializeEnv() {
	await loadSecrets();
	env = createServerEnv();
}
