import type { JobDetailViewQuery } from "@/components/job-detail/__generated__/JobDetailViewQuery.graphql";
import JobDetailViewQueryNode from "@/components/job-detail/__generated__/JobDetailViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import JobDetailViewClientComponent from "./JobDetailViewClientComponent";
import type { pageJobDetailFragment$key } from "./__generated__/pageJobDetailFragment.graphql";

const PageJobDetailFragment = graphql`
 fragment pageJobDetailFragment on Query @inline @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
    job(slug: $slug) {
      __typename
      ... on Job {
        title
		description
		company {
			logoUrl
		}
      }
	 
    }
  }
`;

const fetchAndCacheQuery = cache(async (slug: string) => {
	console.log("fetching job...");

	return await loadSerializableQuery<
		typeof JobDetailViewQueryNode,
		JobDetailViewQuery
	>(JobDetailViewQueryNode, {
		slug: slug,
	});
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	try {
		const preloadedQuery = await fetchAndCacheQuery(slug);

		const data = readInlineData<pageJobDetailFragment$key>(
			PageJobDetailFragment,
			preloadedQuery.data,
		);

		if (data.job.__typename !== "Job") {
			notFound();
		}

		return {
			title: data.job.title,
			description: data.job.description,
			openGraph: {
				images: [data.job.company?.logoUrl || "/default-image.img"],
			},
		};
	} catch (error) {
		console.log("Error in generateMetadata: ", error);
		notFound();
	}
}

export default async function JobDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;

	const preloadedQuery = await fetchAndCacheQuery(slug);

	return <JobDetailViewClientComponent preloadedQuery={preloadedQuery} />;
}
