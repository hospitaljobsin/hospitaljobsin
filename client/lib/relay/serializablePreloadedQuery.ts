import type {
	ConcreteRequest,
	GraphQLResponse,
	OperationType,
	VariablesOf,
} from "relay-runtime";

export interface SerializablePreloadedQuery<
	TRequest extends ConcreteRequest,
	TQuery extends OperationType,
> {
	params: TRequest["params"];
	variables: VariablesOf<TQuery>;
	data: TQuery["response"];
	graphQLResponse: GraphQLResponse;
}
