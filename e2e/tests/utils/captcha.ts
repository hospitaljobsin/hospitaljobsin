import type { Page } from "@playwright/test";

export async function waitForCaptcha({ page }: { page: Page }) {
	await page.waitForLoadState("networkidle");
	// Wait for the iframe with the Turnstile captcha to appear on the page

	const frame = page.frame({ url: /.*cloudflare.*/ });

	if (!frame) {
		throw new Error("Turnstile iframe not found");
	}

	await page.waitForSelector("aside#cf-turnstile", { state: "attached" });
}
