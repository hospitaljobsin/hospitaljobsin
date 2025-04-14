import type { pageApplicantDetailMetadataFragment$key } from "@/__generated__/pageApplicantDetailMetadataFragment.graphql";
import type ApplicantDetailViewQueryNode from "@/__generated__/pageApplicantDetailViewQuery.graphql";
import type { pageApplicantDetailViewQuery } from "@/__generated__/pageApplicantDetailViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import ApplicantDetailViewClientComponent from "./ApplicantDetailViewClientComponent";

export const PageApplicantDetailViewQuery = graphql`
  query pageApplicantDetailViewQuery($id: ID!) {	
    ...pageApplicantDetailMetadataFragment @arguments(id: $id)
    ...ApplicantDetailViewClientComponentFragment @arguments(id: $id)
  }
`;

const PageApplicantDetailMetadataFragment = graphql`
 fragment pageApplicantDetailMetadataFragment on Query @inline @argumentDefinitions(
    id: {
        type: "ID!",
      }
    ) {
    node(id: $id) {
      __typename
      ... on JobApplicant {
        __typename
        account {
            fullName
            avatarUrl
        }
      }
     
    }
  }
`;

// Function to load and cache the query result
const loadJobApplicant = cache(async (id: string) => {
	return await loadSerializableQuery<
		typeof ApplicantDetailViewQueryNode,
		pageApplicantDetailViewQuery
	>(PageApplicantDetailViewQuery, {
		id: id,
	});
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string; jobSlug: string; id: string }>;
}) {
	const id = (await params).id;
	const preloadedQuery = await loadJobApplicant(decodeURIComponent(id));

	const data = readInlineData<pageApplicantDetailMetadataFragment$key>(
		PageApplicantDetailMetadataFragment,
		preloadedQuery.data,
	);

	// TODO: ensure the applicant belongs to the right job
	if (!data.node || data.node.__typename !== "JobApplicant") {
		return {
			title: "Job Applicant Not found",
			description: "The job applicant you are looking for does not exist",
			openGraph: {
				images: ["/default-image.img"],
			},
		};
	}

	return {
		title: data.node.account.fullName,
		openGraph: {
			images: [data.node.account.avatarUrl || "/default-image.img"],
		},
	};
}

export default async function ApplicantDetailPage({
	params,
}: {
	params: Promise<{ slug: string; jobSlug: string; id: string }>;
}) {
	const id = (await params).id;

	const preloadedQuery = await loadJobApplicant(decodeURIComponent(id));

	const data = readInlineData<pageApplicantDetailMetadataFragment$key>(
		PageApplicantDetailMetadataFragment,
		preloadedQuery.data,
	);

	// TODO: ensure the applicant belongs to the right job
	if (!data.node || data.node.__typename !== "JobApplicant") {
		notFound();
	}

	return <ApplicantDetailViewClientComponent preloadedQuery={preloadedQuery} />;
}
