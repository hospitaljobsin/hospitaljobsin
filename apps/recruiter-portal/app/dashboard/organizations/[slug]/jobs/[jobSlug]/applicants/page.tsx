import type { pageJobApplicantsMetadataFragment$key } from "@/__generated__/pageJobApplicantsMetadataFragment.graphql";
import type JobApplicantsViewQueryNode from "@/__generated__/pageJobApplicantsViewQuery.graphql";
import type { pageJobApplicantsViewQuery } from "@/__generated__/pageJobApplicantsViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import JobApplicantsViewClientComponent from "./JobApplicantsViewClientComponent";

export const PageJobApplicantsViewQuery = graphql`
  query pageJobApplicantsViewQuery($slug: String!) {	
    ...pageJobApplicantsMetadataFragment @arguments(slug: $slug)
    ...JobApplicantsViewClientComponentFragment @arguments(slug: $slug)
  }
`;

const PageJobApplicantsMetadataFragment = graphql`
 fragment pageJobApplicantsMetadataFragment on Query @inline @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
    job(slug: $slug) {
      __typename
      ... on Job {
        title
        organization {
            name
            description
            logoUrl
            isMember
        }
      }
     
    }
  }
`;

// Function to load and cache the query result
const loadJob = cache(async (slug: string) => {
	return await loadSerializableQuery<
		typeof JobApplicantsViewQueryNode,
		pageJobApplicantsViewQuery
	>(PageJobApplicantsViewQuery, {
		slug: slug,
	});
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string; jobSlug: string }>;
}) {
	const slug = (await params).jobSlug;
	const preloadedQuery = await loadJob(slug);

	const data = readInlineData<pageJobApplicantsMetadataFragment$key>(
		PageJobApplicantsMetadataFragment,
		preloadedQuery.data,
	);

	// only members can view the job applicants
	if (
		data.job.__typename !== "Job" ||
		!data.job.organization ||
		!data.job.organization.isMember
	) {
		return {
			title: "Job Not found",
			description: "The job you are looking for does not exist",
			openGraph: {
				images: ["/default-image.img"],
			},
		};
	}

	return {
		title: data.job.title,
		description: data.job.organization.description,
		openGraph: {
			images: [data.job.organization.logoUrl || "/default-image.img"],
		},
	};
}

export default async function JobApplicantsPage({
	params,
}: {
	params: Promise<{ slug: string; jobSlug: string }>;
}) {
	const slug = (await params).jobSlug;

	const preloadedQuery = await loadJob(slug);

	const data = readInlineData<pageJobApplicantsMetadataFragment$key>(
		PageJobApplicantsMetadataFragment,
		preloadedQuery.data,
	);

	// only members can view the job applicants
	if (
		data.job.__typename !== "Job" ||
		!data.job.organization ||
		!data.job.organization.isMember
	) {
		notFound();
	}

	return <JobApplicantsViewClientComponent preloadedQuery={preloadedQuery} />;
}
