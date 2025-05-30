import { type NextRequest, NextResponse } from "next/server";
import { env } from "./lib/env/client";
import links from "./lib/links";
import { unsign } from "./lib/session";

function getAuthenticationResponse(request: NextRequest): NextResponse {
	const redirectURL = new URL(links.login());
	const returnTo = request.url;
	redirectURL.searchParams.set("return_to", returnTo);
	return NextResponse.redirect(redirectURL);
}

function extractSubdomain(request: NextRequest): string | null {
	const host = request.headers.get("host") || "";
	const hostname = host.split(":")[0];

	// Local development support (e.g., org1.localhost:3000)
	if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
		const match = hostname.match(/^([^.]+)\.localhost/);
		return match?.[1] ?? null;
	}

	// Production environment
	const rootDomain = env.NEXT_PUBLIC_ROOT_DOMAIN.replace(
		/^https?:\/\//,
		"",
	).split(":")[0]; // remove protocol and port
	const isSubdomain =
		hostname !== rootDomain &&
		hostname !== `www.${rootDomain}` &&
		hostname.endsWith(`.${rootDomain}`);

	return isSubdomain ? hostname.replace(`.${rootDomain}`, "") : null;
}

export async function middleware(request: NextRequest) {
	const subdomain = extractSubdomain(request);
	const response = NextResponse.next();
	const sessionCookie = request.cookies.get(env.NEXT_PUBLIC_SESSION_COOKIE_KEY);

	let isAuthenticated = false;

	if (sessionCookie !== undefined) {
		try {
			const payload = await unsign(sessionCookie.value);
			if (payload?.session_token) {
				isAuthenticated = true;
			}
		} catch (error) {
			console.error("Error unsigning session cookie:", error);
			request.cookies.delete(env.NEXT_PUBLIC_SESSION_COOKIE_KEY);
		}
	}

	if (!isAuthenticated) {
		console.log("Unauthenticated user. Redirecting to login.");
		return getAuthenticationResponse(request);
	}

	if (subdomain) {
		console.log("Authenticated request from subdomain:", subdomain);
		// Optionally: add subdomain to request headers for downstream use
		request.headers.set("x-org-subdomain", subdomain);
		return response;
	} else {
		// TODO: this wont happen actually -> hospitaljobs.in points to seeker portal
		console.log(
			"Authenticated but no subdomain. Redirecting to org selection/dashboard.",
		);
		// This can be based on session: e.g., payload.default_org_slug
		return response;
		// const fallbackURL = new URL(links.orgPickerOrDefaultDashboard(), request.url);
		// return NextResponse.redirect(fallbackURL);
	}
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
