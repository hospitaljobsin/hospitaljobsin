import { env } from "@/lib/env/client";
import links from "@/lib/links";
import { redirect } from "next/navigation";
import { cache } from "react";
import type {
	GraphQLResponse,
	RequestParameters,
	Variables,
} from "relay-runtime";
import { Environment, Network, RecordSource, Store } from "relay-runtime";

export async function networkFetch(
	request: RequestParameters,
	variables: Variables,
): Promise<GraphQLResponse> {
	const { cookies } = await import("next/headers");
	const serverCookie = await cookies();

	let method = "POST";
	let url = `${env.NEXT_PUBLIC_INTERNAL_API_URL}/graphql`;
	let body: string | undefined;
	const headers: Record<string, string> = {
		Accept: "application/json",
		"Accept-Encoding": "gzip",
		Cookie: serverCookie.toString(),
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
				// when an AuthenticationError is thrown in a resolver
				case "UNAUTHENTICATED":
					redirect(links.login(links.dashboard));
					break;
				case "REQUIRES_SUDO_MODE":
					redirect(links.accountSettingsRequestSudo());
					break;
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

function createNetwork() {
	async function fetchResponse(
		params: RequestParameters,
		variables: Variables,
	) {
		return await networkFetch(params, variables);
	}

	const network = Network.create(fetchResponse);
	return network;
}

export const createServerEnvironment = cache(() => {
	return new Environment({
		log: console.log,
		network: createNetwork(),
		store: new Store(RecordSource.create()),
		isServer: true,
	});
});
