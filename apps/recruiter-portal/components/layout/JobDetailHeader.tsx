"use client";
import { Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import Link from "next/link";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import type { JobDetailHeaderQuery as JobDetailHeaderQueryType } from "@/__generated__/JobDetailHeaderQuery.graphql";
import links from "@/lib/links";
import JobTabs from "../job-detail/JobTabs";
import Logo from "../Logo";
import AuthNavigation from "./AuthNavigation";

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

	invariant(
		data.organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);

	invariant(
		data.organization.job.__typename === "Job",
		"Expected 'Job' node type",
	);

	return (
		<div className="w-full flex flex-col bg-background border-b border-gray-300">
			<Navbar maxWidth="lg" position="static">
				<NavbarContent justify="start" className="w-full">
					<NavbarBrand className="flex items-center gap-4 w-full">
						<Link href={links.dashboard} className="font-medium text-inherit">
							<Logo />
						</Link>
						<div className="hidden gap-4 sm:flex sm:items-center">
							<Link
								href={links.organizationDetail(data.organization.slug)}
								className="text-inherit"
							>
								{data.organization.name}
							</Link>
							<span>/</span>
						</div>
						<Link
							href={links.organizationJobDetail(
								data.organization.slug,
								data.organization.job.slug,
							)}
							className="font-medium text-inherit truncate"
						>
							{data.organization.job.title}
						</Link>
						<div className="ml-auto">
							<AuthNavigation rootQuery={data.viewer} />
						</div>
					</NavbarBrand>
				</NavbarContent>
			</Navbar>
			<div className="w-full max-w-5xl mx-auto flex items-center justify-between">
				<JobTabs job={data.organization.job} />
			</div>
		</div>
	);
}
