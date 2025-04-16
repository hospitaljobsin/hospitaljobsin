import type { pageApplicantDetailMetadataFragment$key } from "@/__generated__/pageApplicantDetailMetadataFragment.graphql";
import type ApplicantDetailViewQueryNode from "@/__generated__/pageApplicantDetailViewQuery.graphql";
import type { pageApplicantDetailViewQuery } from "@/__generated__/pageApplicantDetailViewQuery.graphql";
import loadSerializableQuery from "@/lib/relay/loadSerializableQuery";
import { notFound } from "next/navigation";
import { cache } from "react";
import { graphql, readInlineData } from "relay-runtime";
import ApplicantDetailViewClientComponent from "./ApplicantDetailViewClientComponent";

export const PageApplicantDetailViewQuery = graphql`
  query pageApplicantDetailViewQuery($slug: String!, $jobSlug: String!, $applicantSlug: String!) {	
    ...pageApplicantDetailMetadataFragment @arguments(slug: $slug, jobSlug: $jobSlug, applicantSlug: $applicantSlug)
    ...ApplicantDetailViewClientComponentFragment @arguments(slug: $slug, jobSlug: $jobSlug, applicantSlug: $applicantSlug)
  }
`;

const PageApplicantDetailMetadataFragment = graphql`
 fragment pageApplicantDetailMetadataFragment on Query @inline @argumentDefinitions(
    slug: { type: "String!"}
	applicantSlug: { type: "String!"}
	jobSlug: { type: "String!"}
    ) {
		organization(slug: $slug) {
			__typename
			... on Organization {
				isMember
				job(slug: $jobSlug) {
					__typename
					... on Job {
					__typename
					jobApplicant(slug: $applicantSlug) {
					__typename
					... on JobApplicant {
						account {
							fullName
							avatarUrl
						}
					}
					}
				}
				
				}
			}
		}

  }
`;

// Function to load and cache the query result
const loadJobApplicant = cache(
	async (slug: string, jobSlug: string, applicantSlug: string) => {
		return await loadSerializableQuery<
			typeof ApplicantDetailViewQueryNode,
			pageApplicantDetailViewQuery
		>(PageApplicantDetailViewQuery, {
			slug: slug,
			jobSlug: jobSlug,
			applicantSlug: applicantSlug,
		});
	},
);

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string; jobSlug: string; applicantSlug: string }>;
}) {
	const pathParams = await params;
	const slug = decodeURIComponent(pathParams.slug);
	const jobSlug = decodeURIComponent(pathParams.jobSlug);
	const applicantSlug = decodeURIComponent(pathParams.applicantSlug);
	const preloadedQuery = await loadJobApplicant(slug, jobSlug, applicantSlug);

	const data = readInlineData<pageApplicantDetailMetadataFragment$key>(
		PageApplicantDetailMetadataFragment,
		preloadedQuery.data,
	);

	if (
		data.organization.__typename !== "Organization" ||
		data.organization.job.__typename !== "Job" ||
		data.organization.job.jobApplicant.__typename !== "JobApplicant" ||
		!data.organization.isMember
	) {
		return {
			title: "Job Applicant Not found",
			description: "The job applicant you are looking for does not exist",
			openGraph: {
				images: ["/default-image.img"],
			},
		};
	}

	return {
		title: data.organization.job.jobApplicant.account?.fullName,
		openGraph: {
			images: [
				data.organization.job.jobApplicant.account?.avatarUrl ||
					"/default-image.img",
			],
		},
	};
}

export default async function ApplicantDetailPage({
	params,
}: {
	params: Promise<{ slug: string; jobSlug: string; applicantSlug: string }>;
}) {
	const pathParams = await params;
	const slug = decodeURIComponent(pathParams.slug);
	const jobSlug = decodeURIComponent(pathParams.jobSlug);
	const applicantSlug = decodeURIComponent(pathParams.applicantSlug);
	const preloadedQuery = await loadJobApplicant(slug, jobSlug, applicantSlug);

	const data = readInlineData<pageApplicantDetailMetadataFragment$key>(
		PageApplicantDetailMetadataFragment,
		preloadedQuery.data,
	);

	if (
		data.organization.__typename !== "Organization" ||
		data.organization.job.__typename !== "Job" ||
		data.organization.job.jobApplicant.__typename !== "JobApplicant" ||
		!data.organization.isMember
	) {
		notFound();
	}

	return <ApplicantDetailViewClientComponent preloadedQuery={preloadedQuery} />;
}
