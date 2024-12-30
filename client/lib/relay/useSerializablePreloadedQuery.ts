import { useMemo } from "react";
import type { PreloadFetchPolicy, PreloadedQuery } from "react-relay";
import type {
	ConcreteRequest,
	IEnvironment,
	OperationType,
} from "relay-runtime";
import { responseCache } from "./environments/client";
import type { SerializablePreloadedQuery } from "./loadSerializableQuery";

export default function useSerializablePreloadedQuery<
	TRequest extends ConcreteRequest,
	TQuery extends OperationType,
>(
	environment: IEnvironment,
	preloadQuery: SerializablePreloadedQuery<TRequest, TQuery>,
	fetchPolicy: PreloadFetchPolicy = "store-or-network",
): PreloadedQuery<TQuery> {
	useMemo(() => {
		writePreloadedQueryToCache(preloadQuery);
	}, [preloadQuery]);

	return {
		environment,
		fetchKey: preloadQuery.params.id ?? preloadQuery.params.cacheID,
		fetchPolicy,
		isDisposed: false,
		name: preloadQuery.params.name,
		kind: "PreloadedQuery",
		variables: preloadQuery.variables,
		dispose: () => {
			return;
		},
	};
}

function writePreloadedQueryToCache<
	TRequest extends ConcreteRequest,
	TQuery extends OperationType,
>(preloadedQueryObject: SerializablePreloadedQuery<TRequest, TQuery>) {
	// TODO: write the normalized data to cache here
	const cacheKey =
		preloadedQueryObject.params.id ?? preloadedQueryObject.params.cacheID;
	responseCache?.set(
		cacheKey,
		preloadedQueryObject.variables,
		preloadedQueryObject.graphQLResponse,
	);
}
