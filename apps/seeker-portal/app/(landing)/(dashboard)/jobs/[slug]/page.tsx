import type { pageJobDetailMetadataFragment$key } from "@/__generated__/pageJobDetailMetadataFragment.graphql";
import type JobDetailViewQueryNode from "@/__generated__/pageJobDetailViewQuery.graphql";
import type { pageJobDetailViewQuery } from "@/__generated__/pageJobDetailViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import type { Metadata } from "next";
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
		description
		organization {
			logoUrl
		}
      }
	 
    }
  }
`;

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
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const slug = decodeURIComponent((await params).slug);

	const preloadedQuery = await loadJob(slug);

	const data = readInlineData<pageJobDetailMetadataFragment$key>(
		PageJobDetailMetadataFragment,
		preloadedQuery.data,
	);

	if (data.job.__typename !== "Job") {
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

export default async function JobDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	const preloadedQuery = await loadJob(slug);

	const data = readInlineData<pageJobDetailMetadataFragment$key>(
		PageJobDetailMetadataFragment,
		preloadedQuery.data,
	);

	if (data.job.__typename !== "Job") {
		notFound();
	}

	return <JobDetailViewClientComponent preloadedQuery={preloadedQuery} />;
}
