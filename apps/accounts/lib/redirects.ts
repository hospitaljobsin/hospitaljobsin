import { env } from "./env/client";
import links from "./links";

// validate redirect to URLs to prevent open redirect attacks
// https://thecopenhagenbook.com/open-redirect
export function getValidRedirectURL(redirectTo: string | null): string {
	if (!redirectTo) return links.seekerLanding;

	// return the absolute URL, which is needed for Oauth2 redirects
	if (redirectTo.startsWith("/")) return `${env.NEXT_PUBLIC_URL}${redirectTo}`;

	return redirectTo.startsWith(env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL) ||
		redirectTo.startsWith(env.NEXT_PUBLIC_SEEKER_PORTAL_BASE_URL)
		? redirectTo
		: links.seekerLanding;
}

export function getValidSudoModeRedirectURL(redirectTo: string | null): string {
	if (!redirectTo) return links.settings;

	// only allow relative URLs or recruiter portal URLs
	if (
		redirectTo.startsWith("/") ||
		redirectTo.startsWith(env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL)
	)
		return redirectTo;

	return links.settings;
}
