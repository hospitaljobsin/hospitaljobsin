import { type NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_KEY = process.env.AUTH_COOKIE_KEY || "session";

const AUTHENTICATED_ROUTES = [
	new RegExp("/saved(/.*)?"),
	new RegExp("/profile"),
];

const ANONYMOUS_ROUTES = [new RegExp("/auth(/.*)?")];

const requiresAuthenticated = (request: NextRequest): boolean => {
	return AUTHENTICATED_ROUTES.some((route) =>
		route.test(request.nextUrl.pathname),
	);
};

const requiresAnonymous = (request: NextRequest): boolean => {
	return ANONYMOUS_ROUTES.some((route) => route.test(request.nextUrl.pathname));
};

const getAuthenticationResponse = (request: NextRequest): NextResponse => {
	const redirectURL = request.nextUrl.clone();
	redirectURL.pathname = "/auth/login";
	redirectURL.search = "";
	const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
	redirectURL.searchParams.set("return_to", returnTo);
	return NextResponse.redirect(redirectURL);
};

const getAnonymousResponse = (request: NextRequest): NextResponse => {
	const redirectURL = request.nextUrl.clone();
	redirectURL.pathname = "/";
	return NextResponse.redirect(redirectURL);
};

export async function middleware(request: NextRequest) {
	let user: null | string = null;
	const response = NextResponse.next();

	if (request.cookies.has(AUTH_COOKIE_KEY)) {
		user = "user";
		// const api = buildServerSideAPI(request.headers, request.cookies)
		// try {
		//   user = await api.users.getAuthenticated({ cache: 'no-cache' })
		// } catch (e) {
		//   if (e instanceof ResponseError === false || e.response.status !== 401) {
		//     throw e
		//   }
		// }
	}

	if (requiresAuthenticated(request) && !user) {
		return getAuthenticationResponse(request);
	}

	if (requiresAnonymous(request) && user) {
		return getAnonymousResponse(request);
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
