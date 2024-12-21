import type { SerializablePreloadedQuery } from "@/lib/relay/loadSerializableQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import type { ReactNode } from "react";
import { createContext } from "react";
import { usePreloadedQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import type AuthProviderQueryNode from "./__generated__/AuthProviderQuery.graphql";
import type { AuthProviderQuery as AuthProviderQueryType } from "./__generated__/AuthProviderQuery.graphql";

const AuthProviderQuery = graphql`
    query AuthProviderQuery {
        viewer {
            __typename
        }
    }
`;

// Define the type for your authentication state
interface AuthContextType {
	isAuthenticated: boolean;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);

// Create a provider component
export const AuthProvider = ({
	children,
	preloadedQuery,
}: {
	children: ReactNode;
	preloadedQuery: SerializablePreloadedQuery<
		typeof AuthProviderQueryNode,
		AuthProviderQueryType
	>;
}) => {
	const environment = useRelayEnvironment();
	const queryRef = useSerializablePreloadedQuery(environment, preloadedQuery);
	// we need to make this a preloaded query, server needs to send this data on all requests
	const data = usePreloadedQuery<AuthProviderQueryType>(
		AuthProviderQuery,
		queryRef,
	);
	return (
		<AuthContext.Provider
			value={{ isAuthenticated: data.viewer.__typename === "Account" }}
		>
			{children}
		</AuthContext.Provider>
	);
};
