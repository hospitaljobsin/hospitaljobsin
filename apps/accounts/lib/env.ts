import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

async function loadSecrets() {
	if (process.env.AWS_SECRET_ID !== undefined) {
		const secretId = process.env.AWS_SECRET_ID;
		const runtimeApi = process.env.AWS_LAMBDA_RUNTIME_API;
		if (runtimeApi) {
			// use local Secrets & Parameters Extension
			const url = `http://${runtimeApi}/secretsmanager/get?secretId=${encodeURIComponent(secretId)}`;
			const res = await fetch(url, {
				headers: {
					"X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN ?? "",
				},
			});
			if (!res.ok) {
				throw new Error(
					`Failed to load secret from extension: ${res.status} ${res.statusText}`,
				);
			}
			const payload = await res.json();
			if (!payload.SecretString) {
				throw new Error("SecretString missing in extension response");
			}
			const secret = JSON.parse(payload.secretString);
			if (secret.jwe_secret_key) {
				process.env.JWE_SECRET_KEY = secret.jwe_secret_key;
			}
		}
	}
}

loadSecrets().catch((err) => {
	console.error("Failed to load secrets", err);
	process.exit(1);
});

export const env = createEnv({
	server: {
		SESSION_COOKIE_KEY: z.string().default("user_session"),
		JWE_SECRET_KEY: z.string(),
		API_URL: z.string().url(),
	},
	client: {
		NEXT_PUBLIC_URL: z.string().url(),
		NEXT_PUBLIC_API_URL: z.string().url(),
		NEXT_PUBLIC_CAPTCHA_SITE_KEY: z.string(),
		NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL: z.string().url(),
		NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL: z.string().url(),
	},
	// For Next.js >= 13.4.4, you only need to destructure client variables:
	experimental__runtimeEnv: {
		NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_CAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY,
		NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL:
			process.env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL,
		NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL:
			process.env.NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
	 * This is especially useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
