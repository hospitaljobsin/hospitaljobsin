"use client";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import type {
	CacheConfig,
	GraphQLResponse,
	RequestParameters,
	Variables,
} from "relay-runtime";
import {
	Environment,
	Network,
	QueryResponseCache,
	RecordSource,
	Store,
} from "relay-runtime";

const CACHE_TTL = 5 * 1000; // 5 seconds, to resolve preloaded results

export async function networkFetch(
	request: RequestParameters,
	variables: Variables,
): Promise<GraphQLResponse> {
	let method = "POST";
	let url = `${env.NEXT_PUBLIC_API_URL}/graphql`;
	let body: string | undefined;
	const headers: Record<string, string> = {
		Accept: "application/json",
	};

	if (request.operationKind === "query") {
		// For GET requests, use query parameters as per GraphQL over HTTP specification
		method = "GET";
		const searchParams = new URLSearchParams();

		if (request.id) {
			searchParams.append("document_id", request.id);
		}

		if (variables && Object.keys(variables).length > 0) {
			searchParams.append("variables", JSON.stringify(variables));
		}

		url = `${url}?${searchParams.toString()}`;
	} else {
		// For POST requests (mutations), use request body
		headers["Content-Type"] = "application/json";
		body = JSON.stringify({
			document_id: request.id,
			variables,
		});
	}

	const resp = await fetch(url, {
		method,
		headers,
		credentials: "include",
		body,
	});
	const json = await resp.json();

	// GraphQL returns exceptions (for example, a missing required variable) in the "errors"
	// property of the response. If any exceptions occurred when processing the request,
	// throw an error to indicate to the developer what went wrong.
	if (Array.isArray(json.errors)) {
		for (const err of json.errors) {
			switch (err.extensions?.code) {
				// Apollo Server sets code to UNAUTHENTICATED
				// when an AuthenticationError is thrown in a resolver
				case "UNAUTHENTICATED":
					window.location.href = links.login();
			}
		}
		console.error(json.errors);
		throw new Error(
			`Error fetching GraphQL query '${
				request.name
			}' with variables '${JSON.stringify(variables)}': ${JSON.stringify(
				json.errors,
			)}`,
		);
	}

	return json;
}

export const responseCache: QueryResponseCache = new QueryResponseCache({
	size: 100,
	ttl: CACHE_TTL,
});

function createNetwork() {
	async function fetchResponse(
		params: RequestParameters,
		variables: Variables,
		cacheConfig: CacheConfig,
	) {
		const isQuery = params.operationKind === "query";
		const cacheKey = params.id ?? params.cacheID;
		const forceFetch = cacheConfig?.force;
		if (isQuery && !forceFetch) {
			const fromCache = responseCache.get(cacheKey, variables);
			if (fromCache != null) {
				return Promise.resolve(fromCache);
			}
		}

		return await networkFetch(params, variables);
	}

	const network = Network.create(fetchResponse);
	return network;
}

export function createClientEnvironment() {
	console.log("creating a new client environment");
	return new Environment({
		log: console.log,
		network: createNetwork(),
		store: new Store(RecordSource.create()),
		isServer: false,
	});
}
