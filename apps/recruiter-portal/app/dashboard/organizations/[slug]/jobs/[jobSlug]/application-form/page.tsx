import type { pageJobApplicationFormMetadataFragment$key } from "@/__generated__/pageJobApplicationFormMetadataFragment.graphql";
import type JobApplicationFormViewQueryNode from "@/__generated__/pageJobApplicationFormViewQuery.graphql";
import type { pageJobApplicationFormViewQuery } from "@/__generated__/pageJobApplicationFormViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import JobApplicationFormViewClientComponent from "./JobApplicationFormViewClientComponent";

export const PageJobApplicationFormViewQuery = graphql`
  query pageJobApplicationFormViewQuery($slug: String!) {	
    ...pageJobApplicationFormMetadataFragment @arguments(slug: $slug)
    ...JobApplicationFormViewClientComponentFragment @arguments(slug: $slug)
  }
`;

const PageJobApplicationFormMetadataFragment = graphql`
 fragment pageJobApplicationFormMetadataFragment on Query @inline @argumentDefinitions(
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
		typeof JobApplicationFormViewQueryNode,
		pageJobApplicationFormViewQuery
	>(PageJobApplicationFormViewQuery, {
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

	const data = readInlineData<pageJobApplicationFormMetadataFragment$key>(
		PageJobApplicationFormMetadataFragment,
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

export default async function JobApplicationFormPage({
	params,
}: {
	params: Promise<{ slug: string; jobSlug: string }>;
}) {
	const slug = (await params).jobSlug;

	const preloadedQuery = await loadJob(slug);

	const data = readInlineData<pageJobApplicationFormMetadataFragment$key>(
		PageJobApplicationFormMetadataFragment,
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

	return (
		<JobApplicationFormViewClientComponent preloadedQuery={preloadedQuery} />
	);
}
