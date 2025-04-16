import type { pageJobApplicationFormMetadataFragment$key } from "@/__generated__/pageJobApplicationFormMetadataFragment.graphql";
import type JobApplicationFormViewQueryNode from "@/__generated__/pageJobApplicationFormViewQuery.graphql";
import type { pageJobApplicationFormViewQuery } from "@/__generated__/pageJobApplicationFormViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import JobApplicationFormViewClientComponent from "./JobApplicationFormViewClientComponent";

export const PageJobApplicationFormViewQuery = graphql`
  query pageJobApplicationFormViewQuery($slug: String! $jobSlug: String!) {	
    ...pageJobApplicationFormMetadataFragment @arguments(slug: $slug, jobSlug: $jobSlug)
    ...JobApplicationFormViewClientComponentFragment @arguments(slug: $slug, jobSlug: $jobSlug)
  }
`;

const PageJobApplicationFormMetadataFragment = graphql`
 fragment pageJobApplicationFormMetadataFragment on Query @inline @argumentDefinitions(
      slug: {
        type: "String!",
      }
	  jobSlug: {type: "String!"}
    ) {
		organization(slug: $slug) {
			__typename
			... on Organization {
				name
				description
				logoUrl
				isAdmin
				job(slug: $jobSlug) {
				__typename
				... on Job {
					title
				}
				
				}
			}
		}

  }
`;

// Function to load and cache the query result
const loadJob = cache(async (slug: string, jobSlug: string) => {
	return await loadSerializableQuery<
		typeof JobApplicationFormViewQueryNode,
		pageJobApplicationFormViewQuery
	>(PageJobApplicationFormViewQuery, {
		slug: slug,
		jobSlug: jobSlug,
	});
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string; jobSlug: string }>;
}) {
	const pathParams = await params;
	const slug = decodeURIComponent(pathParams.slug);
	const jobSlug = decodeURIComponent(pathParams.jobSlug);
	const preloadedQuery = await loadJob(slug, jobSlug);

	const data = readInlineData<pageJobApplicationFormMetadataFragment$key>(
		PageJobApplicationFormMetadataFragment,
		preloadedQuery.data,
	);

	// only members can edit the job application form
	if (
		data.organization.__typename !== "Organization" ||
		data.organization.job.__typename !== "Job" ||
		!data.organization.isAdmin
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
		title: data.organization.job.title,
		description: data.organization.description,
		openGraph: {
			images: [data.organization.logoUrl || "/default-image.img"],
		},
	};
}

export default async function JobApplicationFormPage({
	params,
}: {
	params: Promise<{ slug: string; jobSlug: string }>;
}) {
	const pathParams = await params;
	const slug = decodeURIComponent(pathParams.slug);
	const jobSlug = decodeURIComponent(pathParams.jobSlug);
	const preloadedQuery = await loadJob(slug, jobSlug);

	const data = readInlineData<pageJobApplicationFormMetadataFragment$key>(
		PageJobApplicationFormMetadataFragment,
		preloadedQuery.data,
	);

	// only admins can edit the job application form
	if (
		data.organization.__typename !== "Organization" ||
		data.organization.job.__typename !== "Job" ||
		!data.organization.isAdmin
	) {
		notFound();
	}

	return (
		<JobApplicationFormViewClientComponent preloadedQuery={preloadedQuery} />
	);
}
