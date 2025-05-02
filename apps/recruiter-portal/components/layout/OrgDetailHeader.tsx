"use client";
import type { OrgDetailHeaderOrganizationFragment$key } from "@/__generated__/OrgDetailHeaderOrganizationFragment.graphql";
import type { OrgDetailHeaderQueryFragment$key } from "@/__generated__/OrgDetailHeaderQueryFragment.graphql";
import links from "@/lib/links";
import { Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import Link from "next/link";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import Logo from "../Logo";
import OrganizationTabs from "../organization-detail/OrganizationTabs";
import AuthNavigation from "./AuthNavigation";

const OrgDetailHeaderQueryFragment = graphql`
  fragment OrgDetailHeaderQueryFragment on Query {
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
  name
  slug
}`;

export default function OrgDetailHeader({
	organization,
	query,
}: {
	organization: OrgDetailHeaderOrganizationFragment$key;
	query: OrgDetailHeaderQueryFragment$key;
}) {
	// TODO: move this query to the parent layout component
	const data = useFragment(OrgDetailHeaderQueryFragment, query);
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
				<NavbarContent justify="start">
					<NavbarBrand className="flex items-center gap-4">
						<Link href={links.dashboard} className="font-medium text-inherit">
							<Logo />
						</Link>
						<Link
							href={links.organizationDetail(orgData.slug)}
							className="font-medium text-inherit"
						>
							{orgData.name}
						</Link>
					</NavbarBrand>
				</NavbarContent>

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
