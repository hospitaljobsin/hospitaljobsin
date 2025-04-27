"use client";
import type { JobDetailHeaderJobFragment$key } from "@/__generated__/JobDetailHeaderJobFragment.graphql";
import type { JobDetailHeaderQuery as JobDetailHeaderQueryType } from "@/__generated__/JobDetailHeaderQuery.graphql";
import links from "@/lib/links";
import { Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import Link from "next/link";
import { useFragment, useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import Logo from "../Logo";
import JobTabs from "../job-detail/JobTabs";
import AuthNavigation from "./AuthNavigation";

const JobDetailHeaderQuery = graphql`
  query JobDetailHeaderQuery {
    viewer {
      ... on Account {
        __typename
        ...AuthNavigationFragment
      }
      ... on NotAuthenticatedError {
        __typename
      }
    }
  }
`;

const JobDetailHeaderJobFragment = graphql`
fragment JobDetailHeaderJobFragment on Job {
  ...JobTabsFragment
  title
  slug
  organization {
    name
    slug
  }
}`;

export default function JobDetailHeader({
	job,
}: { job: JobDetailHeaderJobFragment$key }) {
	const data = useLazyLoadQuery<JobDetailHeaderQueryType>(
		JobDetailHeaderQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	const jobData = useFragment(JobDetailHeaderJobFragment, job);

	const organization = jobData.organization;
	invariant(organization, "Expected 'Organization' node type");

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
								href={links.organizationDetail(organization.slug)}
								className="text-inherit"
							>
								{organization.name}
							</Link>
							<span>/</span>
						</div>
						<Link
							href={links.organizationJobDetail(
								organization.slug,
								jobData.slug,
							)}
							className="font-medium text-inherit truncate"
						>
							{jobData.title}
						</Link>
						<div className="ml-auto">
							<AuthNavigation rootQuery={data.viewer} />
						</div>
					</NavbarBrand>
				</NavbarContent>
			</Navbar>
			<div className="w-full max-w-5xl mx-auto flex items-center justify-between">
				<JobTabs job={jobData} />
			</div>
		</div>
	);
}
