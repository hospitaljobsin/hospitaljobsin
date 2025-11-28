import { redirect } from 'next/navigation';
import { cache } from 'react';
import type { CacheConfig, GraphQLResponse, RequestParameters, Variables } from 'relay-runtime';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { env } from '@/lib/env/client';
import links from '@/lib/links';

interface CacheConfigMetadata {
	// Whether to include authentication credentials in the request
	includeAuth?: boolean;
	// Additional fetch options
	options?: RequestInit;
	[key: string]: unknown;
}

export interface CustomCacheConfig extends CacheConfig {
	// Whether to include authentication credentials in the request
	metadata?: CacheConfigMetadata;
}

/**
 * Creates a canonicalized copy of variables with keys sorted alphabetically
 * to ensure consistent serialization regardless of key order
 */
function canonicalizeVariables<T>(variables: T): T {
	if (!variables || typeof variables !== 'object' || Array.isArray(variables)) {
		return variables;
	}

	const result: Record<string, any> = {};

	// Sort keys alphabetically
	Object.keys(variables)
		.sort()
		.forEach(key => {
			const value = variables[key as keyof T];
			// Recursively canonicalize nested objects
			result[key] = typeof value === 'object' && value !== null ? canonicalizeVariables(value) : value;
		});

	return result as T;
}

export async function networkFetch(
	request: RequestParameters,
	variables: Variables,
	options: RequestInit = {},
	includeAuth = false
): Promise<GraphQLResponse> {
	let method = 'POST';
	let url = `${env.NEXT_PUBLIC_INTERNAL_API_URL}/graphql`;
	let body: string | undefined;
	let serverCookie: string | undefined;
	if (includeAuth) {
		const { cookies } = require('next/headers');
		serverCookie = (await cookies()).toString();
		options.credentials = 'include';
	}
	const extraHeaders = options.headers as Record<string, string> | undefined;
	const headers: Record<string, string> = {
		Accept: 'application/json',
		'Accept-Encoding': 'gzip',
		Connection: 'keep-alive',
		...extraHeaders,
		...(includeAuth && serverCookie ? { Cookie: serverCookie } : {})
	};

	// remove headers from options so we don't pass them twice
	delete options.headers;

	if (request.operationKind === 'query') {
		// For GET requests, use query parameters as per GraphQL over HTTP specification
		method = 'GET';
		const searchParams = new URLSearchParams();

		if (request.id) {
			searchParams.append('document_id', request.id);
		}

		if (variables && Object.keys(variables).length > 0) {
			searchParams.append('variables', JSON.stringify(canonicalizeVariables(variables)));
		}

		url = `${url}?${searchParams.toString()}`;
	} else {
		// For POST requests (mutations), use request body
		headers['Content-Type'] = 'application/json';
		body = JSON.stringify({
			document_id: request.id,
			variables: canonicalizeVariables(variables)
		});
	}

	// Create an AbortController with a 30-second timeout
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 30000);

	try {
		const resp = await fetch(url, {
			method,
			headers,
			body,
			signal: controller.signal,
			keepalive: true,
			...options
		});
		const json = await resp.json();
		clearTimeout(timeoutId);

		// GraphQL returns exceptions (for example, a missing required variable) in the "errors"
		// property of the response. If any exceptions occurred when processing the request,
		// throw an error to indicate to the developer what went wrong.
		if (Array.isArray(json.errors)) {
			for (const err of json.errors) {
				switch (err.extensions?.code) {
					// when an AuthenticationError is thrown in a resolver
					case 'UNAUTHENTICATED':
						redirect(links.login(links.landing));
				}
			}
			console.error(json.errors);
			throw new Error(
				`Error fetching GraphQL query '${request.name}' with variables '${JSON.stringify(variables)}': ${JSON.stringify(json.errors)}`
			);
		}

		return json;
	} catch (error) {
		clearTimeout(timeoutId);
		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error(`Request timeout after 30s for GraphQL query '${request.name}'`);
		}
		throw error;
	} finally {
		clearTimeout(timeoutId);
	}
}

function createNetwork() {
	async function fetchResponse(params: RequestParameters, variables: Variables, cacheConfig: CustomCacheConfig) {
		return await networkFetch(params, variables, cacheConfig.metadata?.options ?? {}, cacheConfig.metadata?.includeAuth || false);
	}

	const network = Network.create(fetchResponse);
	return network;
}

export const createServerEnvironment = cache(() => {
	return new Environment({
		// log: console.log,
		network: createNetwork(),
		store: new Store(RecordSource.create()),
		isServer: true
	});
});
