import RequestSudoView from "@/components/request-sudo/RequestSudoView";
import { getValidSudoModeRedirectURL } from "@/lib/redirects";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { isSudoModeActive } from "@/lib/sudoMode";
import { redirect } from "next/navigation";
import { cache } from "react";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import type RequestSudoModeViewQueryNode from "./__generated__/pageRequestSudoModeViewQuery.graphql";
import type { pageRequestSudoModeViewQuery } from "./__generated__/pageRequestSudoModeViewQuery.graphql";

export const PageRequestSudoModeViewQuery = graphql`
  query pageRequestSudoModeViewQuery {	
	viewer {
		__typename
		... on Account {
			sudoModeExpiresAt
		}
	}
  }
`;

// Function to load and cache the query result
const loadQuery = cache(async () => {
	return await loadSerializableQuery<
		typeof RequestSudoModeViewQueryNode,
		pageRequestSudoModeViewQuery
	>(PageRequestSudoModeViewQuery, {});
});

export default async function RequestSudoModePage({
	searchParams,
}: {
	searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const redirectParam = (await searchParams)?.return_to;
	const redirectTo = getValidSudoModeRedirectURL(
		redirectParam ? String(redirectParam) : null,
	);
	const { data } = await loadQuery();
	invariant(data.viewer.__typename === "Account", "Account expected");

	if (isSudoModeActive(data.viewer.sudoModeExpiresAt)) {
		redirect(redirectTo);
	}

	return (
		<div className="w-full mx-auto max-w-5xl h-full min-h-screen px-4 py-6 bg-background">
			<RequestSudoView />
		</div>
	);
}
