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
  query pageJobDetailViewQuery($slug: String!, $jobSlug: String!) {
	...pageJobDetailMetadataFragment @arguments(slug: $slug, jobSlug: $jobSlug)
    ...JobDetailViewClientComponentFragment @arguments(slug: $slug, jobSlug: $jobSlug)
  }
`;

const PageJobDetailMetadataFragment = graphql`
 fragment pageJobDetailMetadataFragment on Query @inline @argumentDefinitions(
      slug: { type: "String!"}
	  jobSlug: { type: "String!"}
    ) {
		organization(slug: $slug) {
			__typename
			... on Organization {
			bannerUrl
			job(slug: $jobSlug) {
			__typename
			... on Job {
				title
				descriptionCleaned
				isVisible
			}
			}
		}
	}
  }
`;

// FIXME: this won't memoize...
const loadJob = cache(async (slug: string, jobSlug: string) => {
	console.log("loading job...");
	return await loadSerializableQuery<
		typeof JobDetailViewQueryNode,
		pageJobDetailViewQuery
	>(PageJobDetailViewQuery, {
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

	console.log("generating metadata for job", slug, jobSlug);
	const preloadedQuery = await loadJob(slug, jobSlug);

	const data = readInlineData<pageJobDetailMetadataFragment$key>(
		PageJobDetailMetadataFragment,
		preloadedQuery.data,
	);

	if (data.organization.__typename !== "Organization") {
		return {
			title: "Organization Not found",
			description: "The organization you are looking for does not exist",
		};
	}

	if (
		data.organization.job.__typename !== "Job" ||
		!data.organization.job.isVisible
	) {
		return {
			title: "Job Not found",
			description: "The job you are looking for does not exist",
		};
	}

	return {
		title: data.organization.job.title,
		description: data.organization.job.descriptionCleaned,
		openGraph: {
			images: [data.organization.bannerUrl],
		},
	};
}

export default async function JobDetailPage({
	params,
}: {
	params: Promise<{ slug: string; jobSlug: string }>;
}) {
	const pathParams = await params;
	const slug = decodeURIComponent(pathParams.slug);
	const jobSlug = decodeURIComponent(pathParams.jobSlug);

	console.log("rendering page...");
	const preloadedQuery = await loadJob(slug, jobSlug);

	const data = readInlineData<pageJobDetailMetadataFragment$key>(
		PageJobDetailMetadataFragment,
		preloadedQuery.data,
	);

	if (
		data.organization.__typename !== "Organization" ||
		data.organization.job.__typename !== "Job" ||
		!data.organization.job.isVisible
	) {
		notFound();
	}

	return <JobDetailViewClientComponent preloadedQuery={preloadedQuery} />;
}
