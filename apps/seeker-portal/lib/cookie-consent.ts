import Cookies from "js-cookie";
import { env } from "./env/client";

// Cookie consent utility functions using API and js-cookie

export function getCookie(name: string): string | null {
	return Cookies.get(name) || null;
}

export function deleteCookie(name: string) {
	Cookies.remove(name);
}

export function cookieConsentGiven(): string {
	const consent = Cookies.get("cookie_consent");
	if (!consent) {
		return "undecided";
	}
	return consent;
}

export async function setCookieConsent(consent: "yes" | "no"): Promise<void> {
	try {
		const response = await fetch(
			`${env.NEXT_PUBLIC_API_URL}/auth/terms-privacy/set-consent`,
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
