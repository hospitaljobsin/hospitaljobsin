"use client";
import type { JobDetailHeaderQuery as JobDetailHeaderQueryType } from "@/__generated__/JobDetailHeaderQuery.graphql";
import links from "@/lib/links";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import JobTabs from "../job-detail/JobTabs";

export const JobDetailHeaderQuery = graphql`
	query JobDetailHeaderQuery($slug: String!, $jobSlug: String!) {
		viewer {
      ... on Account {
        __typename
        ...AuthNavigationFragment
      }
      ... on NotAuthenticatedError {
        __typename
      }
    }
		organization(slug: $slug) {
			__typename
			... on Organization {
				slug
				name
				job(slug: $jobSlug) {
					__typename
					... on Job {
						...JobTabsFragment
						title
						slug
					}
				}
			}
		}

	}
`;

export default function JobDetailHeader({
	queryReference,
}: {
	queryReference: PreloadedQuery<JobDetailHeaderQueryType>;
}) {
	const data = usePreloadedQuery(JobDetailHeaderQuery, queryReference);
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	if (
		data.organization.__typename !== "Organization" ||
		data.organization.job.__typename !== "Job"
	) {
		return null;
	}

	return (
		<div className="pt-8 w-full max-w-7xl">
			<Breadcrumbs className="mb-6 pl-6">
				<BreadcrumbItem href={links.dashboard}>Jobs</BreadcrumbItem>
				<BreadcrumbItem isCurrent>{data.organization.job.title}</BreadcrumbItem>
			</Breadcrumbs>

			<div className="w-full flex flex-col border-b border-foreground-300">
				<div className="w-full flex items-center justify-between">
					<JobTabs job={data.organization.job} />
				</div>
			</div>
		</div>
	);
}
