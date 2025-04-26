import {
	GetSecretValueCommand,
	SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

if (process.env.AWS_SECRET_ID !== undefined) {
	const client = new SecretsManagerClient({
		region: process.env.AWS_REGION,
		credentials: defaultProvider(),
	});

	const cmd = new GetSecretValueCommand({
		SecretId: process.env.AWS_SECRET_ID, // the secret ID that contains your JWE key
	});
	const resp = await client.send(cmd);

	if (resp.SecretString === undefined) {
		throw new Error("SecretString not found for AWS secret.");
	}

	const secret = JSON.parse(resp.SecretString);
	if (secret.jwe_secret_key !== undefined) {
		process.env.JWE_SECRET_KEY = secret.jwe_secret_key;
	}
}

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
