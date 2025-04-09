import type { pageJobDetailMetadataFragment$key } from "@/__generated__/pageJobDetailMetadataFragment.graphql";
import type JobDetailViewQueryNode from "@/__generated__/pageJobDetailViewQuery.graphql";
import type { pageJobDetailViewQuery } from "@/__generated__/pageJobDetailViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import JobDetailViewClientComponent from "./JobDetailViewClientComponent";

export const PageJobDetailViewQuery = graphql`
  query pageJobDetailViewQuery($slug: String!) {	
	...pageJobDetailMetadataFragment @arguments(slug: $slug)
	...JobDetailViewClientComponentFragment @arguments(slug: $slug)
  }
`;

const PageJobDetailMetadataFragment = graphql`
 fragment pageJobDetailMetadataFragment on Query @inline @argumentDefinitions(
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
		typeof JobDetailViewQueryNode,
		pageJobDetailViewQuery
	>(PageJobDetailViewQuery, {
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

	const data = readInlineData<pageJobDetailMetadataFragment$key>(
		PageJobDetailMetadataFragment,
		preloadedQuery.data,
	);

	// only members can view the job
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

export default async function JobDetailPage({
	params,
}: {
	params: Promise<{ slug: string; jobSlug: string }>;
}) {
	const slug = (await params).jobSlug;

	const preloadedQuery = await loadJob(slug);

	const data = readInlineData<pageJobDetailMetadataFragment$key>(
		PageJobDetailMetadataFragment,
		preloadedQuery.data,
	);

	// only members can view the job
	if (
		data.job.__typename !== "Job" ||
		!data.job.organization ||
		!data.job.organization.isMember
	) {
		notFound();
	}

	return <JobDetailViewClientComponent preloadedQuery={preloadedQuery} />;
}
