import { env } from '@/lib/env/client';
import links from '@/lib/links';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import type { CacheConfig, GraphQLResponse, RequestParameters, Variables } from 'relay-runtime';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';

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

export async function networkFetch(request: RequestParameters, variables: Variables, options: RequestInit = {}): Promise<GraphQLResponse> {
	console.log('MAKING A SERVER SIDE REQUEST...', request.id);
	let method = 'POST';
	let url = `${env.NEXT_PUBLIC_INTERNAL_API_URL}/graphql`;
	let body: string | undefined;
	const extraHeaders = options.headers as Record<string, string> | undefined;
	const headers: Record<string, string> = {
		Accept: 'application/json',
		'Accept-Encoding': 'gzip',
		...extraHeaders
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

	const resp = await fetch(url, {
		method,
		headers,
		body,
		...options
	});
	const json = await resp.json();

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
}

function createNetwork() {
	async function fetchResponse(params: RequestParameters, variables: Variables, cacheConfig: CacheConfig) {
		console.log('fetchResponse called...', params, variables, cacheConfig);
		// FIXME: pass custom headers here
		// this is the reason we need to make an additional call, even though revalidate and cache options are passed!
		return await networkFetch(params, variables);
	}

	const network = Network.create(fetchResponse);
	return network;
}

// FIXME: a new server environment is creating for gen metadata and the view hierarchy
// we need to be able to get a single server environment to optimize queries
export const createServerEnvironment = cache(() => {
	return new Environment({
		// log: console.log,
		network: createNetwork(),
		store: new Store(RecordSource.create()),
		isServer: true
	});
});
