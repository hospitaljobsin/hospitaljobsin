"use server";
import { loadSecrets } from "@/lib/secrets";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4-mini";

function createServerEnv(): Readonly<{
	JWE_SECRET_KEY: string;
}> {
	return createEnv({
		server: {
			JWE_SECRET_KEY: z.string(),
		},
		runtimeEnv: {
			JWE_SECRET_KEY: process.env.JWE_SECRET_KEY,
		},
		skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	});
}

let _env: ReturnType<typeof createServerEnv> | null = null;

export async function getEnv() {
	if (_env === null) {
		await loadSecrets();
		_env = createServerEnv();
	}
	return _env;
}
