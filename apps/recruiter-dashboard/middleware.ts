import { type NextRequest, NextResponse } from "next/server";
import { ORG_SUBDOMAIN_HEADER_NAME } from "./lib/constants";
import { env } from "./lib/env/client";
import links from "./lib/links";
import { unsign } from "./lib/session";

function getAuthenticationResponse(
	request: NextRequest,
	host: string,
): NextResponse {
	const protocol = request.nextUrl.protocol;
	const redirectURL = new URL(links.login());

	// Construct the returnTo URL using desired protocol and host, and preserving pathname + search
	const pathname = request.nextUrl.pathname;
	const search = request.nextUrl.search;

	const returnTo = `${protocol}://${host}${pathname}${search}`;

	console.log("Redirecting to login for unauthenticated request:", returnTo);
	console.log(request.nextUrl);

	redirectURL.searchParams.set("return_to", returnTo);
	return NextResponse.redirect(redirectURL);
}

function extractSubdomain(request: NextRequest): string | null {
	const host = request.headers.get("host") || "";
	const hostname = host.split(":")[0];

	// Local development support (e.g., org1.localhost:3000)
	if (hostname.includes("localtest.me")) {
		const match = hostname.match(/^([^.]+)\.localtest.me/);
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
	const host = request.headers.get("host") || "";
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

	if (subdomain) {
		if (!isAuthenticated) {
			console.log(request);
			return getAuthenticationResponse(request, host);
		}
		console.log("Authenticated request from subdomain:", subdomain);
		// TODO: if we have the /new route, redirect to it the recruiter subdomain
		const requestHeaders = new Headers(request.headers);
		requestHeaders.set(ORG_SUBDOMAIN_HEADER_NAME, subdomain);
		return NextResponse.next({
			request: {
				// New request headers
				headers: requestHeaders,
			},
		});
	}

	return response;
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
