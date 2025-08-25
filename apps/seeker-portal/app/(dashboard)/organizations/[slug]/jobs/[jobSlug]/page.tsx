import type { pageJobDetailMetadataFragment$key } from "@/__generated__/pageJobDetailMetadataFragment.graphql";
import type JobDetailViewQueryNode from "@/__generated__/pageJobDetailViewQuery.graphql";
import type { pageJobDetailViewQuery } from "@/__generated__/pageJobDetailViewQuery.graphql";
import { env } from "@/lib/env/client";
import { getEmploymentType } from "@/lib/jsonLd";
import links from "@/lib/links";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import type { JobPosting, WithContext } from "schema-dts";
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
			logoUrl
			name
			location
			website
			job(slug: $jobSlug) {
			__typename
			... on Job {
				title
				descriptionCleaned
				descriptionHtml
				isVisible
				createdAt
				workMode
				type
				expiresAt
				location
				minSalary
				maxSalary
				slug
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

	const jsonLd: WithContext<JobPosting> = {
		"@context": "https://schema.org",
		"@type": "JobPosting",
		image: data.organization.bannerUrl,
		title: data.organization.job.title,
		url: `${env.NEXT_PUBLIC_URL}${links.jobDetailApply(slug, jobSlug)}`,
		description: data.organization.job.descriptionHtml,
		jobLocation: {
			"@type": "Place",
			address: data.organization.job.location || undefined,
		},
		datePosted: new Date(data.organization.job.createdAt).toISOString(),
		validThrough: new Date(data.organization.job.expiresAt).toISOString(),
		employmentType: data.organization.job.type
			? getEmploymentType(data.organization.job.type)
			: undefined,
		jobLocationType:
			data.organization.job.workMode === "REMOTE" ? "TELECOMMUTE" : "ONSITE",
		// TODO: avoid hardcoding this
		applicantLocationRequirements: {
			"@type": "Country",
			name: "India",
		},
		directApply: true,
		hiringOrganization: {
			"@type": "Organization",
			name: data.organization.name,
			description: data.organization.job.descriptionCleaned,
			image: data.organization.logoUrl,
			sameAs: data.organization.website || undefined,
		},
		baseSalary:
			data.organization.job.minSalary || data.organization.job.maxSalary
				? {
						"@type": "MonetaryAmount",
						currency: "INR",
						value: {
							"@type": "QuantitativeValue",
							unitText: "MONTH",
							minValue: data.organization.job.minSalary || undefined,
							maxValue: data.organization.job.maxSalary || undefined,
						},
					}
				: undefined,
		identifier: {
			"@type": "PropertyValue",
			name: "Job Slug",
			value: data.organization.job.slug,
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
				}}
			/>
			<JobDetailViewClientComponent preloadedQuery={preloadedQuery} />
		</>
	);
}
