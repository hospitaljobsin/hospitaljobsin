import type { pageJobApplyMetadataFragment$key } from "@/__generated__/pageJobApplyMetadataFragment.graphql";
import type JobApplyViewQueryNode from "@/__generated__/pageJobApplyViewQuery.graphql";
import type { pageJobApplyViewQuery } from "@/__generated__/pageJobApplyViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import JobApplyViewClientComponent from "./JobApplyViewClientComponent";

export const PageJobApplyViewQuery = graphql`
  query pageJobApplyViewQuery($slug: String!) {	
    ...pageJobApplyMetadataFragment @arguments(slug: $slug)
    ...JobApplyViewClientComponentFragment @arguments(slug: $slug)
  }
`;

const PageJobApplyMetadataFragment = graphql`
 fragment pageJobApplyMetadataFragment on Query @inline @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
    job(slug: $slug) {
      __typename
      ... on Job {
        title
        description
		isApplied
        organization {
            logoUrl
        }
      }
     
    }
  }
`;

const loadJob = cache(async (slug: string) => {
	return await loadSerializableQuery<
		typeof JobApplyViewQueryNode,
		pageJobApplyViewQuery
	>(PageJobApplyViewQuery, {
		slug: slug,
	});
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const slug = decodeURIComponent((await params).slug);

	const preloadedQuery = await loadJob(slug);

	const data = readInlineData<pageJobApplyMetadataFragment$key>(
		PageJobApplyMetadataFragment,
		preloadedQuery.data,
	);

	// only users who have not applied can access this page
	if (data.job.__typename !== "Job" || data.job.isApplied) {
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
		description: data.job.description,
		openGraph: {
			images: [data.job.organization?.logoUrl || "/default-image.img"],
		},
	};
}

export default async function JobApplyPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	const preloadedQuery = await loadJob(slug);

	const data = readInlineData<pageJobApplyMetadataFragment$key>(
		PageJobApplyMetadataFragment,
		preloadedQuery.data,
	);

	// only users who have not applied can access this page
	if (data.job.__typename !== "Job" || data.job.isApplied) {
		notFound();
	}

	return <JobApplyViewClientComponent preloadedQuery={preloadedQuery} />;
}
