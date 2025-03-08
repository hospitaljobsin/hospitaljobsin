import jwt from "jsonwebtoken";

export function unsign(
	signedValue: string,
	secretKey: string,
): Record<string, string> {
	return jwt.decode(signedValue, { complete: true, json: true })
		?.payload as Record<string, string>;
}
