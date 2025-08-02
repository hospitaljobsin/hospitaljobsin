"use client";
import type { PostHogIdentifierQuery as PostHogIdentifierQueryType } from "@/__generated__/PostHogIdentifierQuery.graphql";
import posthog from "posthog-js";
import { useEffect } from "react";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery, useQueryLoader } from "react-relay";
import { graphql } from "relay-runtime";

export const PostHogIdentifierQuery = graphql`
  query PostHogIdentifierQuery {
    viewer {
        __typename
      ... on Account {
        __typename
        id
        email
      }
    }
  }
`;

export default function PostHogIdentifier() {
	const [queryReference, loadQuery, disposeQuery] =
		useQueryLoader<PostHogIdentifierQueryType>(PostHogIdentifierQuery);

	useEffect(() => {
		// Only load query if PostHog is not identified
		// TODO: also load query only if authenticated (prolly get this value from cookies to avoid unnecessary calls on anon users)
		if (!posthog._isIdentified()) {
			loadQuery({});
		}
	}, [loadQuery]);

	// If no query reference, don't render anything
	if (!queryReference) {
		return null;
	}

	return (
		<PostHogIdentifierContent
			queryReference={queryReference}
			disposeQuery={disposeQuery}
		/>
	);
}

function PostHogIdentifierContent({
	queryReference,
	disposeQuery,
}: {
	queryReference: PreloadedQuery<PostHogIdentifierQueryType>;
	disposeQuery: () => void;
}) {
	const data = usePreloadedQuery<PostHogIdentifierQueryType>(
		PostHogIdentifierQuery,
		queryReference,
	);

	useEffect(() => {
		// Only identify if user is authenticated and PostHog is not already identified
		if (data.viewer.__typename === "Account" && !posthog._isIdentified()) {
			const account = data.viewer;

			// Identify the user with their account ID and additional properties
			posthog.identify(account.id, {
				email: account.email,
			});

			// Dispose the query after identification
			disposeQuery();
		}
	}, [data.viewer, disposeQuery]);

	// This component doesn't render anything
	return null;
}
