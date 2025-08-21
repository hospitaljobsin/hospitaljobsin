import { env } from "./env";

/**
 * Creates HTTP basic authentication headers if the environment variables are set
 * @returns Headers object with Authorization header if credentials are provided, empty object otherwise
 */
export function getBasicAuthHeaders(): Record<string, string> {
	if (env.BASIC_AUTH_USERNAME && env.BASIC_AUTH_PASSWORD) {
		const credentials = `${env.BASIC_AUTH_USERNAME}:${env.BASIC_AUTH_PASSWORD}`;
		const encodedCredentials = Buffer.from(credentials).toString("base64");
		return {
			Authorization: `Basic ${encodedCredentials}`,
		};
	}
	return {};
}

/**
 * Checks if basic authentication is configured
 * @returns true if both username and password are set
 */
export function isBasicAuthConfigured(): boolean {
	return !!(env.BASIC_AUTH_USERNAME && env.BASIC_AUTH_PASSWORD);
}
