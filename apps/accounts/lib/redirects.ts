import { env } from "./env/client";
import links from "./links";

// validate redirect to URLs to prevent open redirect attacks
// https://thecopenhagenbook.com/open-redirect
export function getValidRedirectURL(redirectTo: string | null): string {
	if (!redirectTo) return links.seekerLanding;

	// return the absolute URL, which is needed for Oauth2 redirects
	if (redirectTo.startsWith("/")) return `${env.NEXT_PUBLIC_URL}${redirectTo}`;

	try {
		const url = new URL(redirectTo);

		const rootDomain = env.NEXT_PUBLIC_ROOT_DOMAIN;
		const isSubdomain =
			url.hostname === rootDomain || url.hostname.endsWith(`.${rootDomain}`);

		if (isSubdomain) {
			return redirectTo;
		}
	} catch {
		// invalid URL, fall back
	}

	return links.seekerLanding;
}

export function getValidSudoModeRedirectURL(redirectTo: string | null): string {
	if (!redirectTo) return links.settings;

	// only allow relative URLs or recruiter portal URLs
	if (redirectTo.startsWith("/")) return `${env.NEXT_PUBLIC_URL}${redirectTo}`;

	try {
		const url = new URL(redirectTo);

		const rootDomain = env.NEXT_PUBLIC_ROOT_DOMAIN;
		const isSubdomain = url.hostname.endsWith(`.${rootDomain}`);

		console.log("is subdomain: ", isSubdomain);

		console.log("redirect to: ", redirectTo);

		if (isSubdomain) {
			return redirectTo;
		}
	} catch {
		// invalid URL, fall back
	}

	return links.settings;
}
