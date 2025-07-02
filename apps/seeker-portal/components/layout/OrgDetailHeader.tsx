"use client";
import type { OrgDetailHeaderQuery as OrgDetailHeaderQueryType } from "@/__generated__/OrgDetailHeaderQuery.graphql";
import { APP_NAME } from "@/lib/constants";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import {
	Button,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@heroui/react";
import Link from "next/link";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
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

	return (
		<div className="w-full flex flex-col bg-background-600 border-b border-foreground-300 sticky top-0 z-50">
			<Navbar maxWidth="xl" className="bg-background-600">
				<NavbarBrand className="flex items-center gap-4 text-foreground-500">
					<Link href={links.landing} className="font-medium text-inherit">
						<Logo />
					</Link>
					{data.organization.__typename === "Organization" ? (
						<Link
							href={links.organizationDetail(data.organization.slug)}
							className="font-medium text-inherit truncate max-w-32 sm:max-w-xs flex-1 hidden sm:block"
						>
							{data.organization.name}
						</Link>
					) : (
						<Link
							href={links.landing}
							className="font-medium text-inherit truncate max-w-32 sm:max-w-xs flex-1 hidden sm:block"
						>
							{APP_NAME}
						</Link>
					)}
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
									target="_blank"
									rel="noopener noreferrer"
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
			{data.organization.__typename === "Organization" && (
				<div className="w-full max-w-7xl mx-auto flex items-center justify-between">
					<OrganizationTabs />
				</div>
			)}
		</div>
	);
}
