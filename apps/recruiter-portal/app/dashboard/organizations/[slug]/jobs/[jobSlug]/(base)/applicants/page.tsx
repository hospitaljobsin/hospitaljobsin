import type { pageJobApplicantsMetadataFragment$key } from "@/__generated__/pageJobApplicantsMetadataFragment.graphql";
import type JobApplicantsViewQueryNode from "@/__generated__/pageJobApplicantsViewQuery.graphql";
import type { pageJobApplicantsViewQuery } from "@/__generated__/pageJobApplicantsViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import JobApplicantsViewClientComponent from "./JobApplicantsViewClientComponent";

export const PageJobApplicantsViewQuery = graphql`
  query pageJobApplicantsViewQuery($slug: String!, $jobSlug: String!, $searchTerm: String, $status: JobApplicantStatus, $showStatus: Boolean = true) {	
    ...pageJobApplicantsMetadataFragment @arguments(slug: $slug, jobSlug: $jobSlug)
    ...JobApplicantsViewClientComponentFragment @arguments(slug: $slug, jobSlug: $jobSlug, searchTerm: $searchTerm, status: $status, showStatus: $showStatus)
  }
`;

const PageJobApplicantsMetadataFragment = graphql`
 fragment pageJobApplicantsMetadataFragment on Query @inline @argumentDefinitions(
      slug: {
        type: "String!",
      }
	  jobSlug: { type: "String!" }
    ) {
	organization(slug: $slug) {
		__typename
		... on Organization {
			name
			description
			logoUrl
			isMember
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
		typeof JobApplicantsViewQueryNode,
		pageJobApplicantsViewQuery
	>(PageJobApplicantsViewQuery, {
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

	const data = readInlineData<pageJobApplicantsMetadataFragment$key>(
		PageJobApplicantsMetadataFragment,
		preloadedQuery.data,
	);

	if (data.organization.__typename !== "Organization") {
		return {
			title: "Organization Not found",
			description: "The organization you are looking for does not exist",
		};
	}

	// only members can view the job applicants
	if (
		data.organization.job.__typename !== "Job" ||
		!data.organization.isMember
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

export default async function JobApplicantsPage({
	params,
}: {
	params: Promise<{ slug: string; jobSlug: string }>;
}) {
	const pathParams = await params;
	const slug = decodeURIComponent(pathParams.slug);
	const jobSlug = decodeURIComponent(pathParams.jobSlug);
	const preloadedQuery = await loadJob(slug, jobSlug);

	const data = readInlineData<pageJobApplicantsMetadataFragment$key>(
		PageJobApplicantsMetadataFragment,
		preloadedQuery.data,
	);

	// only members can view the job applicants
	if (
		data.organization.__typename !== "Organization" ||
		data.organization.job.__typename !== "Job" ||
		!data.organization.isMember
	) {
		notFound();
	}

	return <JobApplicantsViewClientComponent preloadedQuery={preloadedQuery} />;
}
