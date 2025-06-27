import { loadSecrets } from "@/lib/secrets";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4-mini";

export function createServerEnv(): Readonly<{
	JWE_SECRET_KEY: string;
	API_URL: string;
}> {
	return createEnv({
		server: {
			JWE_SECRET_KEY: z.string(),
			API_URL: z.url(),
		},
		runtimeEnv: {
			JWE_SECRET_KEY: process.env.JWE_SECRET_KEY,
			API_URL: process.env.API_URL,
		},
		skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	});
}

let _env: ReturnType<typeof createServerEnv> | null = null;

// FIXME: slow RSC times are because secrets are getting loaded every time here
export async function getEnv() {
	if (_env === null) {
		await loadSecrets();
		_env = createServerEnv();
	}
	return _env;
}
