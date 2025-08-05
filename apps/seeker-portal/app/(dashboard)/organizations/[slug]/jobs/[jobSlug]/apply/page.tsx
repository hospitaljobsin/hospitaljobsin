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
  query pageJobApplyViewQuery($slug: String!, $jobSlug: String!) {
    ...pageJobApplyMetadataFragment @arguments(slug: $slug, jobSlug: $jobSlug)
    ...JobApplyViewClientComponentFragment @arguments(slug: $slug, jobSlug: $jobSlug)
  }
`;

const PageJobApplyMetadataFragment = graphql`
 fragment pageJobApplyMetadataFragment on Query @inline @argumentDefinitions(
	slug: { type: "String!"}
	jobSlug: { type: "String!"}
    ) {
		viewer {
			__typename
			... on Account {
				profile {
					isComplete
				}
			}
		}
		organization(slug: $slug) {
			__typename
			... on Organization {
				bannerUrl
				job(slug: $jobSlug) {
				__typename
				... on Job {
					title
					description
					isApplied
					externalApplicationUrl
				}

				}
			}
		}

  }
`;

const loadJob = cache(async (slug: string, jobSlug: string) => {
	return await loadSerializableQuery<
		typeof JobApplyViewQueryNode,
		pageJobApplyViewQuery
	>(PageJobApplyViewQuery, {
		slug: slug,
		jobSlug: jobSlug,
	});
});

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string; jobSlug: string }>;
}): Promise<Metadata> {
	const pathParams = await params;
	const slug = decodeURIComponent(pathParams.slug);
	const jobSlug = decodeURIComponent(pathParams.jobSlug);

	const preloadedQuery = await loadJob(slug, jobSlug);

	const data = readInlineData<pageJobApplyMetadataFragment$key>(
		PageJobApplyMetadataFragment,
		preloadedQuery.data,
	);

	if (data.organization.__typename !== "Organization") {
		return {
			title: "Organization Not found",
			description: "The organization you are looking for does not exist",
		};
	}

	// only users who have not applied can access this page
	if (
		data.organization.job.__typename !== "Job" ||
		data.organization.job.isApplied ||
		data.organization.job.externalApplicationUrl !== null ||
		data.viewer.__typename !== "Account" ||
		!data.viewer.profile?.isComplete
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
		description: data.organization.job.description,
		openGraph: {
			images: [data.organization.bannerUrl || "/default-image.img"],
		},
	};
}

export default async function JobApplyPage({
	params,
}: {
	params: Promise<{ slug: string; jobSlug: string }>;
}) {
	const pathParams = await params;
	const slug = decodeURIComponent(pathParams.slug);
	const jobSlug = decodeURIComponent(pathParams.jobSlug);

	const preloadedQuery = await loadJob(slug, jobSlug);

	const data = readInlineData<pageJobApplyMetadataFragment$key>(
		PageJobApplyMetadataFragment,
		preloadedQuery.data,
	);

	// only users who have not applied can access this page
	if (
		data.organization.__typename !== "Organization" ||
		data.organization.job.__typename !== "Job" ||
		data.organization.job.isApplied ||
		data.organization.job.externalApplicationUrl !== null ||
		data.viewer.__typename !== "Account" ||
		!data.viewer.profile?.isComplete
	) {
		notFound();
	}

	return <JobApplyViewClientComponent preloadedQuery={preloadedQuery} />;
}
