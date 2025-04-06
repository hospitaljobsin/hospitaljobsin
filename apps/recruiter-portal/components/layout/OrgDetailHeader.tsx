"use client";
import type { OrgDetailHeaderOrganizationFragment$key } from "@/__generated__/OrgDetailHeaderOrganizationFragment.graphql";
import type { OrgDetailHeaderQuery as OrgDetailHeaderQueryType } from "@/__generated__/OrgDetailHeaderQuery.graphql";
import { APP_NAME } from "@/lib/constants";
import links from "@/lib/links";
import { Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import Link from "next/link";
import { useFragment, useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import OrganizationTabs from "../organization-detail/OrganizationTabs";
import AuthNavigation from "./AuthNavigation";

const OrgDetailHeaderQuery = graphql`
  query OrgDetailHeaderQuery {
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

const OrgDetailHeaderOrganizationFragment = graphql`
fragment OrgDetailHeaderOrganizationFragment on Organization {
  ...OrganizationTabsFragment
}`;

export default function OrgDetailHeader({
	organization,
}: { organization: OrgDetailHeaderOrganizationFragment$key }) {
	const data = useLazyLoadQuery<OrgDetailHeaderQueryType>(
		OrgDetailHeaderQuery,
		{},
	);
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	const orgData = useFragment(
		OrgDetailHeaderOrganizationFragment,
		organization,
	);

	return (
		<div className="w-full flex flex-col bg-background border-b border-gray-300">
			<Navbar maxWidth="lg" position="static">
				<NavbarBrand>
					<Link href={links.dashboard} className="font-medium text-inherit">
						{APP_NAME}
					</Link>
				</NavbarBrand>

				<NavbarContent justify="end">
					<AuthNavigation rootQuery={data.viewer} />
				</NavbarContent>
			</Navbar>
			<div className="w-full max-w-5xl mx-auto flex items-center justify-between">
				<OrganizationTabs organization={orgData} />
			</div>
		</div>
	);
}
