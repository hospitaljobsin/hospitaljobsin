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

export const networkFetch = cache(
	async (
		request: RequestParameters,
		variables: Variables,
	): Promise<GraphQLResponse> => {
		console.log("making a server side network request...", request.name);
		const { cookies } = await import("next/headers");
		const serverCookie = await cookies();

		const resp = await fetch(`${env.NEXT_PUBLIC_INTERNAL_API_URL}/graphql`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Cookie: serverCookie.toString(),
			},
			credentials: "include",
			body: JSON.stringify({
				document_id: request.id,
				variables,
			}),
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
						redirect(links.login(links.landing));
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
	},
);

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

// FIXME: a new server environment is creating for gen metadata and the view hierarchy
// we need to be able to get a single server environment to optimize queries
export const createServerEnvironment = cache(() => {
	console.log("creating a server environment");
	return new Environment({
		// log: console.log,
		network: createNetwork(),
		store: new Store(RecordSource.create()),
		isServer: true,
	});
});
