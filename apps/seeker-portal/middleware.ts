import { type NextRequest, NextResponse } from 'next/server';
import { env } from './lib/env/client';
import links from './lib/links';
import { unsign } from './lib/session';

const AUTHENTICATED_ROUTES = [/\/saved(\/.*)?/, /\/resume-builder(\/.*)?/, /\/profile/, /\/my-alerts(\/.*)?/];

const ANONYMOUS_ROUTES: RegExp[] = [];

const AI_BOT_USER_AGENTS = [
	'PerplexityBot',
	'Perplexity-User',
	'GPTBot',
	'ChatGPT-User',
	'Google-Extended',
	'Applebot-Extended',
	'anthropic-ai',
	'Claude-Web',
	'ClaudeBot',
	'Gemini',
	'OAI-SearchBot',
	'Facebookbot',
	'Amazonbot',
	'YouBot',
	'NeevaBot',
	'PhindBot',
	'AndiBot',
	'Cohere',
	'DeepSeekBot',
	'CCBot',
	'Omgili',
	'Omgilibot',
	'ByteDance',
	'Character.AI'
];

const MARKDOWN_ELIGIBLE_ROUTES = [/^\/organizations\/[^/]+$/, /^\/jobs\/[^/]+$/, /^\/search\//];

function isAIBot(userAgent: string): boolean {
	return AI_BOT_USER_AGENTS.some(bot => userAgent.includes(bot));
}

function isMarkdownEligibleRoute(pathname: string): boolean {
	return MARKDOWN_ELIGIBLE_ROUTES.some(route => route.test(pathname));
}

function getMarkdownPath(pathname: string): string {
	return `${pathname}.md`;
}

function requiresAuthenticated(request: NextRequest): boolean {
	return AUTHENTICATED_ROUTES.some(route => route.test(request.nextUrl.pathname));
}

function requiresAnonymous(request: NextRequest): boolean {
	return ANONYMOUS_ROUTES.some(route => route.test(request.nextUrl.pathname));
}

function getAuthenticationResponse(request: NextRequest): NextResponse {
	const redirectURL = new URL(links.login());
	const returnTo = `${env.NEXT_PUBLIC_URL}${request.nextUrl.pathname}${request.nextUrl.search}`;
	redirectURL.searchParams.set('return_to', returnTo);
	return NextResponse.redirect(redirectURL);
}

function getAnonymousResponse(request: NextRequest): NextResponse {
	const redirectURL = new URL(links.landing);
	return NextResponse.redirect(redirectURL);
}

export async function middleware(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;
	const userAgent = request.headers.get('user-agent') || '';
	const isDevelopment = env.NEXT_PUBLIC_ENVIRONMENT === 'development';
	const isBot = isAIBot(userAgent);

	// Block direct access to markdown pages in non-dev environments for non-bots
	if (!isDevelopment && !isBot && pathname.endsWith('.md')) {
		return new NextResponse(null, { status: 404 });
	}

	// Redirect bots to markdown version in non-dev environments
	if (!isDevelopment && isBot && isMarkdownEligibleRoute(pathname) && !pathname.endsWith('.md')) {
		const markdownURL = new URL(getMarkdownPath(pathname), request.url);
		markdownURL.search = searchParams.toString();
		return NextResponse.redirect(markdownURL);
	}

	if ((pathname.startsWith('/organizations-md') || pathname.startsWith('/search-md')) && !searchParams.has('via_markdown_rewrite')) {
		return new NextResponse(null, { status: 404 });
	}

	if (
		(pathname.match(/^\/search\/jobs-in\/[^/]+$/) ||
			pathname.match(/^\/search\/[^/]+\/jobs$/) ||
			pathname.match(/^\/search\/[^/]+\/jobs-in\/[^/]+$/)) &&
		!searchParams.has('via_rewrite')
	) {
		return new NextResponse(null, { status: 404 });
	}

	const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
	const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://*.posthog.com;
    style-src 'self' 'nonce-${nonce}' https://*.posthog.com;
    img-src 'self' blob: data: https://*.posthog.com https://*.amazonaws.com https://*.s3.amazonaws.com https://*.s3.*.amazonaws.com;
    font-src 'self' https://*.posthog.com;
    connect-src 'self' https://*.posthog.com;
    worker-src 'self' blob: data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self' ${env.NEXT_PUBLIC_CMS_URL};
    upgrade-insecure-requests;
`;
	// Replace newline characters and spaces
	const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();

	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('x-nonce', nonce);

	requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

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
	requestHeaders.set('x-is-authenticated', isAuthenticated ? 'true' : 'false');

	const response = NextResponse.next({
		request: {
			headers: requestHeaders
		}
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
		{
			source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
			missing: [
				{ type: 'header', key: 'next-router-prefetch' },
				{ type: 'header', key: 'purpose', value: 'prefetch' }
			]
		}
	]
};
