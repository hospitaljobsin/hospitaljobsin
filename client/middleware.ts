import { type NextRequest, NextResponse } from "next/server";
import { loadViewer } from "./lib/auth";

const AUTH_COOKIE_KEY = process.env.AUTH_COOKIE_KEY || "session";

const AUTHENTICATED_ROUTES = [/\/saved(\/.*)?/, /\/profile/];

const ANONYMOUS_ROUTES = [/\/auth(\/.*)?/];

function requiresAuthenticated(request: NextRequest): boolean {
	return AUTHENTICATED_ROUTES.some((route) =>
		route.test(request.nextUrl.pathname),
	);
}

function requiresAnonymous(request: NextRequest): boolean {
	return ANONYMOUS_ROUTES.some((route) => route.test(request.nextUrl.pathname));
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
	const redirectURL = request.nextUrl.clone();
	redirectURL.pathname = "/";
	return NextResponse.redirect(redirectURL);
}

export async function middleware(request: NextRequest) {
	const response = NextResponse.next();

	if (request.cookies.has(AUTH_COOKIE_KEY)) {
		const data = await loadViewer();
		const isValidUser = data.response.data.viewer.__typename === "Account";

		if (!isValidUser) {
			request.cookies.delete(AUTH_COOKIE_KEY);
		}

		if (requiresAuthenticated(request) && !isValidUser) {
			return getAuthenticationResponse(request);
		}

		if (requiresAnonymous(request) && isValidUser) {
			return getAnonymousResponse(request);
		}
	} else {
		if (requiresAuthenticated(request)) {
			return getAuthenticationResponse(request);
		}
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
