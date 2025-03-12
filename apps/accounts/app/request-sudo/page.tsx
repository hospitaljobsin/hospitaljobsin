import type { pageRequestSudoModeInternalFragment$key } from "@/__generated__/pageRequestSudoModeInternalFragment.graphql";
import type RequestSudoModeViewQueryNode from "@/__generated__/pageRequestSudoModeViewQuery.graphql";
import type { pageRequestSudoModeViewQuery } from "@/__generated__/pageRequestSudoModeViewQuery.graphql";
import { getValidSudoModeRedirectURL } from "@/lib/redirects";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { isSudoModeActive } from "@/lib/sudoMode";
import { redirect } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import invariant from "tiny-invariant";
import RequestSudoModeViewClientComponent from "./RequestSudoModeViewClientComponent";

export const PageRequestSudoModeViewQuery = graphql`
  query pageRequestSudoModeViewQuery {	
	...pageRequestSudoModeInternalFragment
	...RequestSudoModeViewClientComponentFragment
  }
`;

const PageRequestSudoModeInternalFragment = graphql`
 fragment pageRequestSudoModeInternalFragment on Query @inline {
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
	const preloadedQuery = await loadQuery();

	const data = readInlineData<pageRequestSudoModeInternalFragment$key>(
		PageRequestSudoModeInternalFragment,
		preloadedQuery.data,
	);
	invariant(data.viewer.__typename === "Account", "Account expected");

	if (isSudoModeActive(data.viewer.sudoModeExpiresAt)) {
		redirect(redirectTo);
	}

	return <RequestSudoModeViewClientComponent preloadedQuery={preloadedQuery} />;
}
