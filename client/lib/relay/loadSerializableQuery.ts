import type {
	ConcreteRequest,
	GraphQLResponse,
	GraphQLTaggedNode,
	OperationType,
	VariablesOf,
} from "relay-runtime";
import {
	createOperationDescriptor,
	fetchQuery,
	getRequest,
} from "relay-runtime";
import { getCurrentEnvironment } from "./environments";
import { networkFetch } from "./environments/server";

export interface SerializablePreloadedQuery<
	TRequest extends ConcreteRequest,
	TQuery extends OperationType,
> {
	params: TRequest["params"];
	variables: VariablesOf<TQuery>;
	data: TQuery["response"];
	graphQLResponse: GraphQLResponse;
}

export default async function loadSerializableQuery<
	TRequest extends ConcreteRequest,
	TQuery extends OperationType,
>(
	taggedNode: GraphQLTaggedNode,
	variables: VariablesOf<TQuery>,
): Promise<SerializablePreloadedQuery<TRequest, TQuery>> {
	const environment = getCurrentEnvironment();

	// Convert params into a valid ConcreteRequest
	const request = getRequest(taggedNode) as TRequest | null;

	if (!request) {
		throw new Error(
			"Invalid request: could not resolve query to ConcreteRequest.",
		);
	}

	const graphQLResponse = await networkFetch(request.params, variables);

	// hydrate relay store with the response
	if ("data" in graphQLResponse && graphQLResponse.data) {
		environment.commitPayload(
			createOperationDescriptor(request, variables),
			graphQLResponse.data,
		);
	}

	// load snapshot from relay store (will fetch from cache)
	// this is necessary to fetch data on the server using (inline) fragments
	// for metadata generation
	const data = await fetchQuery<TQuery>(environment, taggedNode, variables, {
		networkCacheConfig: { force: false },
		fetchPolicy: "store-or-network",
	}).toPromise();

	if (!data) {
		throw new Error("Failed to fetch query data");
	}

	return {
		params: request.params, // Use the resolved ConcreteRequest params
		variables,
		data,
		graphQLResponse,
	};
}
