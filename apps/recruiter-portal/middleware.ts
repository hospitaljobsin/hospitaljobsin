import { type NextRequest, NextResponse } from "next/server";
import { env } from "./lib/env";
import links from "./lib/links";

const AUTH_COOKIE_KEY = env.AUTH_COOKIE_KEY;

const AUTHENTICATED_ROUTES = [
	/^\/dashboard$/,
	/^\/dashboard\/new-organization$/,
];

const ANONYMOUS_ROUTES: RegExp[] = [/^\/$/];

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
	const returnTo = request.url;
	redirectURL.searchParams.set("return_to", returnTo);
	return NextResponse.redirect(redirectURL);
}

function getAnonymousResponse(request: NextRequest): NextResponse {
	const redirectURL = new URL(links.dashboard);
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
