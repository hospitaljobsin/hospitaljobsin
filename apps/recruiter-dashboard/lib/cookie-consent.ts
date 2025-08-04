import Cookies from "js-cookie";
import { COOKIE_ANALYTICS_PREFERENCE } from "./constants";
import { env } from "./env/client";

export function cookieConsentGiven(): string {
	const consent = Cookies.get(COOKIE_ANALYTICS_PREFERENCE);
	if (!consent) {
		return "undecided";
	}
	return consent;
}

export async function setCookieConsent(consent: "yes" | "no"): Promise<void> {
	try {
		const response = await fetch(
			`${env.NEXT_PUBLIC_API_URL}/accounts/analytics/set-preference`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ consent }),
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to set consent: ${response.statusText}`);
		}

		// The cookie is set by the server response
		console.log("Consent cookie set successfully");
	} catch (error) {
		console.error("Error setting consent cookie:", error);
		throw error;
	}
}
