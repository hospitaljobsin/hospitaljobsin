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
	const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
	const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;
	// Replace newline characters and spaces
	const contentSecurityPolicyHeaderValue = cspHeader
		.replace(/\s{2,}/g, " ")
		.trim();

	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-nonce", nonce);

	requestHeaders.set(
		"Content-Security-Policy",
		contentSecurityPolicyHeaderValue,
	);

	const response = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});

	const host = request.headers.get("host") || "";
	const subdomain = extractSubdomain(request);

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
			return getAuthenticationResponse(request, host);
		}
		// TODO: if we have the /new route, redirect to it the recruiter subdomain
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
		{
			source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
	],
};
