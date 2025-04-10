import type { pageJobEditMetadataFragment$key } from "@/__generated__/pageJobEditMetadataFragment.graphql";
import type JobEditViewQueryNode from "@/__generated__/pageJobEditViewQuery.graphql";
import type { pageJobEditViewQuery } from "@/__generated__/pageJobEditViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import JobEditViewClientComponent from "./JobEditViewClientComponent";

export const PageJobEditViewQuery = graphql`
  query pageJobEditViewQuery($slug: String!) {	
    ...pageJobEditMetadataFragment @arguments(slug: $slug)
    ...JobEditViewClientComponentFragment @arguments(slug: $slug)
  }
`;

const PageJobEditMetadataFragment = graphql`
 fragment pageJobEditMetadataFragment on Query @inline @argumentDefinitions(
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
            isAdmin
        }
      }
     
    }
  }
`;

// Function to load and cache the query result
const loadJob = cache(async (slug: string) => {
	return await loadSerializableQuery<
		typeof JobEditViewQueryNode,
		pageJobEditViewQuery
	>(PageJobEditViewQuery, {
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

	const data = readInlineData<pageJobEditMetadataFragment$key>(
		PageJobEditMetadataFragment,
		preloadedQuery.data,
	);

	// only members can edit the job
	if (
		data.job.__typename !== "Job" ||
		!data.job.organization ||
		!data.job.organization.isAdmin
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

export default async function JobEditPage({
	params,
}: {
	params: Promise<{ slug: string; jobSlug: string }>;
}) {
	const slug = (await params).jobSlug;

	const preloadedQuery = await loadJob(slug);

	const data = readInlineData<pageJobEditMetadataFragment$key>(
		PageJobEditMetadataFragment,
		preloadedQuery.data,
	);

	// only admins can edit the job
	if (
		data.job.__typename !== "Job" ||
		!data.job.organization ||
		!data.job.organization.isAdmin
	) {
		notFound();
	}

	return <JobEditViewClientComponent preloadedQuery={preloadedQuery} />;
}
