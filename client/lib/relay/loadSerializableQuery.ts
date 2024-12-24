import type {
	GraphQLResponse,
	OperationType,
	RequestParameters,
	VariablesOf,
} from "relay-runtime";
import type { ConcreteRequest } from "relay-runtime/lib/util/RelayConcreteNode";
import { networkFetch } from "./environments/server";

export interface SerializablePreloadedQuery<
	TRequest extends ConcreteRequest,
	TQuery extends OperationType,
> {
	params: TRequest["params"];
	variables: VariablesOf<TQuery>;
	/** Narrowed type for response using TQuery */
	response: Omit<GraphQLResponse, "data"> & {
		data: TQuery["response"]; // Use TQuery's response type
	};
}

export default async function loadSerializableQuery<
	TRequest extends ConcreteRequest,
	TQuery extends OperationType,
>(
	params: RequestParameters,
	variables: VariablesOf<TQuery>,
): Promise<SerializablePreloadedQuery<TRequest, TQuery>> {
	// TODO: probably call loadQuery here with the getCurrentEnvironment() function (which should be react cached)??
	// this would ensure requests are deduped automatically!
	// https://relay.dev/docs/getting-started/step-by-step-guide/#step-5-fetching-a-query-with-relay
	const response = await networkFetch(params, variables);

	return {
		params,
		variables,
		// Use the GraphQLResponse structure with strong typing
		response: response as Omit<GraphQLResponse, "data"> & {
			data: TQuery["response"];
		},
	};
}
