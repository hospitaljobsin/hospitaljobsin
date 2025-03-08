import { type NextRequest, NextResponse } from "next/server";
import { env } from "./lib/env";
import links from "./lib/links";

const AUTH_COOKIE_KEY = env.AUTH_COOKIE_KEY;

const AUTHENTICATED_ROUTES: RegExp[] = [
	/^\/settings(\/.*)?$/,
	/^\/request-sudo$/,
];

// reset password will be accessed by anonymous users as well as authenticated users
const ANONYMOUS_ROUTES = [/^\/auth\/?(login|signup)?$/];

const REQUIRES_2FA_CHALLENGE_ROUTES = [/^\/auth\/?(2fa|2fa\/recovery)?$/];

function requiresAuthenticated(request: NextRequest): boolean {
	return AUTHENTICATED_ROUTES.some((route) =>
		route.test(request.nextUrl.pathname),
	);
}

function requiresAnonymous(request: NextRequest): boolean {
	return ANONYMOUS_ROUTES.some((route) => route.test(request.nextUrl.pathname));
}

function requires2FAChallenge(request: NextRequest): boolean {
	return REQUIRES_2FA_CHALLENGE_ROUTES.some((route) =>
		route.test(request.nextUrl.pathname),
	);
}

function getAuthenticationResponse(request: NextRequest): NextResponse {
	const redirectURL = request.nextUrl.clone();
	redirectURL.pathname = "/auth/login";
	redirectURL.search = "";
	const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
	redirectURL.searchParams.set("return_to", returnTo);
	return NextResponse.redirect(redirectURL);
}

function getAnonymousResponse(request: NextRequest): NextResponse {
	const redirectURL = new URL(links.seekerLanding);
	return NextResponse.redirect(redirectURL);
}

function get2FAChallengeResponse(request: NextRequest): NextResponse {
	const redirectURL = request.nextUrl.clone();
	redirectURL.pathname = "/auth/login";
	redirectURL.search = "";
	return NextResponse.redirect(redirectURL);
}

export async function middleware(request: NextRequest) {
	const response = NextResponse.next();
	const hasAuthCookie = request.cookies.has(AUTH_COOKIE_KEY);

	if (requiresAuthenticated(request)) {
		return hasAuthCookie ? response : getAuthenticationResponse(request);
	}

	if (requiresAnonymous(request)) {
		return hasAuthCookie ? getAnonymousResponse(request) : response;
	}

	if (requires2FAChallenge(request)) {
		const has2FAChallengeCookie = request.cookies.has("2fa_challenge");
		return has2FAChallengeCookie ? response : get2FAChallengeResponse(request);
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
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
