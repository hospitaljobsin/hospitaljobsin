import type { pageJobSettingsMetadataFragment$key } from "@/__generated__/pageJobSettingsMetadataFragment.graphql";
import type JobSettingsViewQueryNode from "@/__generated__/pageJobSettingsViewQuery.graphql";
import type { pageJobSettingsViewQuery } from "@/__generated__/pageJobSettingsViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import JobSettingsViewClientComponent from "./JobSettingsViewClientComponent";

export const PageJobSettingsViewQuery = graphql`
  query pageJobSettingsViewQuery($slug: String!) {	
    ...pageJobSettingsMetadataFragment @arguments(slug: $slug)
    ...JobSettingsViewClientComponentFragment @arguments(slug: $slug)
  }
`;

const PageJobSettingsMetadataFragment = graphql`
 fragment pageJobSettingsMetadataFragment on Query @inline @argumentDefinitions(
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
		typeof JobSettingsViewQueryNode,
		pageJobSettingsViewQuery
	>(PageJobSettingsViewQuery, {
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

	const data = readInlineData<pageJobSettingsMetadataFragment$key>(
		PageJobSettingsMetadataFragment,
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

export default async function JobSettingsPage({
	params,
}: {
	params: Promise<{ slug: string; jobSlug: string }>;
}) {
	const slug = (await params).jobSlug;

	const preloadedQuery = await loadJob(slug);

	const data = readInlineData<pageJobSettingsMetadataFragment$key>(
		PageJobSettingsMetadataFragment,
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

	return <JobSettingsViewClientComponent preloadedQuery={preloadedQuery} />;
}
