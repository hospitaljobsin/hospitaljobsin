import { compactDecrypt } from "jose";
import { getEnv } from "./env/server";

export async function unsign(
	signedValue: string,
): Promise<Record<string, string>> {
	console.log("Unsigning value:", signedValue);
	console.log("Secret key:", getEnv().JWE_SECRET_KEY);
	const secretKey = new TextEncoder().encode(getEnv().JWE_SECRET_KEY);
	const { plaintext } = await compactDecrypt(signedValue, secretKey);

	// Convert plaintext (Uint8Array) to string and parse JSON
	const payload = JSON.parse(new TextDecoder().decode(plaintext));

	if (typeof payload !== "object" || payload === null) {
		throw new Error("Invalid token");
	}

	return payload as Record<string, string>;
}
