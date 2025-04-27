// env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { loadSecrets } from "../secrets";

export function createServerEnv(): Readonly<{
	JWE_SECRET_KEY: string;
	API_URL: string;
}> {
	return createEnv({
		server: {
			JWE_SECRET_KEY: z.string(),
			API_URL: z.string().url(),
		},
		runtimeEnv: {
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
