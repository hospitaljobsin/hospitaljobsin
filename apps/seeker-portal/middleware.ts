import { type NextRequest, NextResponse } from "next/server";
import { env } from "./lib/env/client";
import links from "./lib/links";
import { unsign } from "./lib/session";

const AUTHENTICATED_ROUTES = [
	/\/saved(\/.*)?/,
	/\/profile/,
	/\/organizations\/[^/]+\/jobs\/[^/]+\/apply$/,
];

const ANONYMOUS_ROUTES: RegExp[] = [];

function requiresAuthenticated(request: NextRequest): boolean {
	return AUTHENTICATED_ROUTES.some((route) =>
		route.test(request.nextUrl.pathname),
	);
}

function requiresAnonymous(request: NextRequest): boolean {
	return ANONYMOUS_ROUTES.some((route) => route.test(request.nextUrl.pathname));
}

function getAuthenticationResponse(request: NextRequest): NextResponse {
	const redirectURL = new URL(links.login());
	const returnTo = `${env.NEXT_PUBLIC_URL}${request.nextUrl.pathname}${request.nextUrl.search}`;
	redirectURL.searchParams.set("return_to", returnTo);
	return NextResponse.redirect(redirectURL);
}

function getAnonymousResponse(request: NextRequest): NextResponse {
	const redirectURL = new URL(links.landing);
	return NextResponse.redirect(redirectURL);
}

export async function middleware(request: NextRequest) {
	const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
	const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://*.posthog.com;
    style-src 'self' 'nonce-${nonce}' https://*.posthog.com;
    img-src 'self' blob: data: https://*.posthog.com;
    font-src 'self' https://*.posthog.com;
    connect-src 'self' https://*.posthog.com;
    worker-src 'self' blob: data:;
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

	const sessionCookie = request.cookies.get(env.NEXT_PUBLIC_SESSION_COOKIE_KEY);

	let isAuthenticated = false;

	if (sessionCookie !== undefined) {
		try {
			const payload = await unsign(sessionCookie.value);
			if (payload.session_token !== undefined) {
				isAuthenticated = true;
			}
		} catch (error) {
			request.cookies.delete(env.NEXT_PUBLIC_SESSION_COOKIE_KEY);
		}
	}

	// Set the authentication header
	requestHeaders.set("x-is-authenticated", isAuthenticated ? "true" : "false");

	const response = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});

	if (requiresAuthenticated(request)) {
		return isAuthenticated ? response : getAuthenticationResponse(request);
	}

	if (requiresAnonymous(request)) {
		return isAuthenticated ? getAnonymousResponse(request) : response;
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		{
			source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
	],
};
