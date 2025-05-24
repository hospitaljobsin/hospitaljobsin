import crypto from "node:crypto";

function generateGravatarHash(email: string): string {
	const trimmedEmail = email.trim().toLowerCase();
	const hash = crypto.createHash("sha256").update(trimmedEmail).digest("hex");
	return hash;
}

export function getGravatarUrl(
	email: string,
	size = 80,
	defaultImage = "identicon",
) {
	const hash = generateGravatarHash(email);
	return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
}
