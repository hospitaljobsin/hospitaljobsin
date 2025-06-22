"use client";
import type { OrgDetailHeaderQuery as OrgDetailHeaderQueryType } from "@/__generated__/OrgDetailHeaderQuery.graphql";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import {
	Button,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@heroui/react";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import Logo from "../Logo";
import OrganizationTabs from "../organization-detail/OrganizationTabs";
import AuthDropdown from "./AuthNavigation";

export const OrgDetailHeaderQuery = graphql`
  query OrgDetailHeaderQuery($slug: String!) {
	viewer {
		__typename
		... on Account {
			...AuthNavigationFragment
		}
		... on NotAuthenticatedError {
			__typename
		}
	}
	organization(slug: $slug) {
		__typename
		... on Organization {
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
		"Expected 'Account' node type.",
	);
	invariant(
		data.organization.__typename === "Organization",
		"Expected 'Organization' node type.",
	);

	return (
		<div className="w-full flex flex-col bg-background border-b border-foreground-300">
			<Navbar maxWidth="xl">
				<NavbarBrand className="flex items-center gap-4">
					<Link href={links.landing} className="font-medium text-inherit">
						<Logo />
					</Link>
					<Link
						href={links.organizationDetail(data.organization.slug)}
						className="font-medium text-inherit"
					>
						{data.organization.name}
					</Link>
				</NavbarBrand>

				<NavbarContent justify="end">
					{data.viewer.__typename === "Account" ? (
						<AuthDropdown rootQuery={data.viewer} />
					) : (
						<>
							<NavbarItem>
								<Button
									as={Link}
									color="default"
									href={links.login(env.NEXT_PUBLIC_URL)}
								>
									Log In
								</Button>
							</NavbarItem>
							<NavbarItem>
								<Button
									as={Link}
									href={links.recruiterLanding}
									isExternal
									color="default"
									variant="flat"
								>
									For recruiters
								</Button>
							</NavbarItem>
						</>
					)}
				</NavbarContent>
			</Navbar>
			<div className="w-full max-w-7xl mx-auto flex items-center justify-between">
				<OrganizationTabs />
			</div>
		</div>
	);
}
