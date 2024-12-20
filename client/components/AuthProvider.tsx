import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { useClientQuery } from "react-relay";
import { graphql } from "relay-runtime";
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
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const data = useClientQuery<AuthProviderQueryType>(AuthProviderQuery, {});
	return (
		<AuthContext.Provider
			value={{ isAuthenticated: data.viewer?.__typename === "Account" }}
		>
			{children}
		</AuthContext.Provider>
	);
};

// Create a custom hook for consuming the context
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
