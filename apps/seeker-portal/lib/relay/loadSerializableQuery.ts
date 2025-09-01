import type {
	ConcreteRequest,
	GraphQLTaggedNode,
	OperationType,
	VariablesOf,
} from "relay-runtime";
import { createOperationDescriptor, getRequest } from "relay-runtime";
import { getCurrentEnvironment } from "./environments";
import { networkFetch } from "./environments/server";
import type { SerializablePreloadedQuery } from "./serializablePreloadedQuery";

export default async function loadSerializableQuery<
	TRequest extends ConcreteRequest,
	TQuery extends OperationType,
>(
	taggedNode: GraphQLTaggedNode,
	variables: VariablesOf<TQuery>,
): Promise<SerializablePreloadedQuery<TRequest, TQuery>> {
	console.log("loading query called...");
	const environment = getCurrentEnvironment();

	// Convert params into a valid ConcreteRequest
	const request = getRequest(taggedNode) as TRequest | null;

	if (!request) {
		throw new Error(
			"Invalid request: could not resolve query to ConcreteRequest.",
		);
	}

	const graphQLResponse = await networkFetch(request.params, variables);

	const operationDescriptor = createOperationDescriptor(request, variables);

	// hydrate relay store with the response
	if ("data" in graphQLResponse && graphQLResponse.data) {
		environment.commitPayload(operationDescriptor, graphQLResponse.data);
	}

	// ✅ Look up the data from the store instead of refetching
	const snapshot = environment.lookup(operationDescriptor.fragment);
	const data = snapshot.data;

	if (!data) {
		throw new Error("Failed to read query data from the store");
	}

	return {
		params: request.params, // Use the resolved ConcreteRequest params
		variables,
		data,
		graphQLResponse,
	};
}
