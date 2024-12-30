import type {
	ConcreteRequest,
	GraphQLTaggedNode,
	OperationType,
	VariablesOf,
} from "relay-runtime";
import { fetchQuery, getRequest } from "relay-runtime";
import { getCurrentEnvironment } from "./environments";
import { networkFetch } from "./environments/server";

export interface SerializablePreloadedQuery<
	TRequest extends ConcreteRequest,
	TQuery extends OperationType,
> {
	params: TRequest["params"];
	variables: VariablesOf<TQuery>;
	response: TQuery["response"];
	raw: any;
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

	const response = await fetchQuery<TQuery>(
		environment,
		taggedNode,
		variables,
	).toPromise();

	if (!response) {
		throw new Error("Failed to fetch query data");
	}

	console.log("response: ", response);

	// const operationDescriptor = createOperationDescriptor(request, variables);

	// // Lookup the data for this operation in the environment
	// const snapshot = environment.lookup(operationDescriptor.fragment);
	// console.log("snapshot: ", snapshot.data);

	const original = await networkFetch(request.params, variables);
	console.log("original: ", original);

	// TODO: convert the relay response to a serializable format

	return {
		params: request.params, // Use the resolved ConcreteRequest params
		variables,
		response,
		raw: original,
	};
}
