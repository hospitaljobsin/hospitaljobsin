"use client";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import type {
	CacheConfig,
	GraphQLResponse,
	RequestParameters,
	UploadableMap,
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
	uploadables: UploadableMap | null = null,
): Promise<GraphQLResponse> {
	const networkRequest = {
		method: "POST",
		credentials: "include",
		headers: {},
	};

	if (uploadables) {
		if (!window.FormData) {
			throw new Error("Uploading files without `FormData` not supported.");
		}

		const formData = new FormData();
		formData.append(
			"operations",
			JSON.stringify({
				document_id: request.id,
				variables: variables,
			}),
		);

		const uploadableMap: {
			[key: string]: string[];
		} = {};

		Object.keys(uploadables).forEach((key) => {
			if (Object.prototype.hasOwnProperty.call(uploadables, key)) {
				uploadableMap[key] = [`variables.${key}`];
			}
		});

		formData.append("map", JSON.stringify(uploadableMap));

		Object.keys(uploadables).forEach((key) => {
			if (Object.prototype.hasOwnProperty.call(uploadables, key)) {
				formData.append(key, uploadables[key]);
			}
		});

		networkRequest.body = formData;
	} else {
		networkRequest.headers["Content-Type"] = "application/json";
		networkRequest.body = JSON.stringify({
			document_id: request.id,
			variables,
		});
	}
	const resp = await fetch(
		`${env.NEXT_PUBLIC_API_URL}/graphql`,
		networkRequest,
	);
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
		uploadables: UploadableMap | null = null,
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

		return await networkFetch(params, variables, uploadables);
	}

	return Network.create(fetchResponse);
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
