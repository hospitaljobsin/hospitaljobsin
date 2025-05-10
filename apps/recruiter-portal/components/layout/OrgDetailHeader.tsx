"use client";
import type { OrgDetailHeaderQuery as OrgDetailHeaderQueryType } from "@/__generated__/OrgDetailHeaderQuery.graphql";
import links from "@/lib/links";
import { Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import Link from "next/link";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import Logo from "../Logo";
import OrganizationTabs from "../organization-detail/OrganizationTabs";
import AuthNavigation from "./AuthNavigation";

export const OrgDetailHeaderQuery = graphql`
	query OrgDetailHeaderQuery($slug: String!) {
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
				...OrganizationTabsFragment
				name
				slug
			}
		}
	}
`;

export default function OrgDetailHeader({
	queryReference,
}: {
	queryReference: PreloadedQuery<OrgDetailHeaderQueryType>;
}) {
	const data = usePreloadedQuery(OrgDetailHeaderQuery, queryReference);
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	invariant(
		data.organization.__typename === "Organization",
		"Expected 'Organization' node type",
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
							href={links.organizationDetail(data.organization.slug)}
							className="font-medium text-inherit"
						>
							{data.organization.name}
						</Link>
					</NavbarBrand>
				</NavbarContent>

				<NavbarContent justify="end">
					<AuthNavigation rootQuery={data.viewer} />
				</NavbarContent>
			</Navbar>
			<div className="w-full max-w-5xl mx-auto flex items-center justify-between">
				<OrganizationTabs organization={data.organization} />
			</div>
		</div>
	);
}
