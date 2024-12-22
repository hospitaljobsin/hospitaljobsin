import type { SerializablePreloadedQuery } from "@/lib/relay/loadSerializableQuery";
import useSerializablePreloadedQuery from "@/lib/relay/useSerializablePreloadedQuery";
import type { ReactNode } from "react";
import { createContext, useState } from "react";
import { usePreloadedQuery, useRelayEnvironment } from "react-relay";
import { graphql } from "relay-runtime";
import type AuthProviderQueryNode from "./__generated__/AuthProviderQuery.graphql";
import type { AuthProviderQuery as AuthProviderQueryType } from "./__generated__/AuthProviderQuery.graphql";

const AuthProviderQuery = graphql`
    query AuthProviderQuery {
        viewer {
            __typename
            ... on Account {
                email
                fullName
            }
            ... on NotAuthenticatedError {
                __typename
            }
        }
    }
`;

export type User = {
    email: string;
    fullName: string;
};

interface AuthContextType {
    user: User | null;
    setUser: (user: User) => void;
    removeUser: () => void;
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
    const data = usePreloadedQuery<AuthProviderQueryType>(
        AuthProviderQuery,
        queryRef,
    );

    // Local state for managing user authentication
    const [user, setUserState] = useState<User | null>(
        data.viewer.__typename === "Account"
            ? { fullName: data.viewer.fullName, email: data.viewer.email }
            : null,
    );

    // Function to set the user (used on login)
    const setUser = (newUser: User) => {
        setUserState(newUser);
    };

    // Function to remove the user (used on logout)
    const removeUser = () => {
        setUserState(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                removeUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
