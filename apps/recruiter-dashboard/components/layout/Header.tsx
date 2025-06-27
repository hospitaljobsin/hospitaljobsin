"use client";
import type { HeaderQuery as HeaderQueryType } from "@/__generated__/HeaderQuery.graphql";
import {
	Dropdown,
	DropdownTrigger,
	Navbar,
	NavbarBrand,
	NavbarContent,
} from "@heroui/react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import AuthNavigation from "./AuthNavigation";
import HeaderOrganizationList from "./HeaderDropdownMenu";

export const HeaderQuery = graphql`
  query HeaderQuery($organizationSlug: String!) {
    viewer {
      ... on Account {
        __typename
        ...AuthNavigationFragment
		...HeaderDropdownMenuFragment
      }
      ... on NotAuthenticatedError {
        __typename
      }
    }
	organization(slug: $organizationSlug) {
		__typename
		... on Organization {
			name
			slug
			logoUrl
		}
	}
  }
`;

export default function Header({
	queryReference,
}: {
	queryReference: PreloadedQuery<HeaderQueryType>;
}) {
	const data = usePreloadedQuery<HeaderQueryType>(HeaderQuery, queryReference);
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);
	invariant(
		data.organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);
	return (
		<>
			<title>{data.organization.name}</title>
			<Navbar maxWidth="lg" isBordered>
				<NavbarBrand>
					<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<div className="flex items-center gap-4 cursor-pointer">
								<div className="relative aspect-square h-8 w-8">
									<Image
										src={data.organization.logoUrl}
										alt="Organization Logo"
										fill
										className="rounded-md object-cover"
										sizes="20vw"
									/>
								</div>
								{data.organization.name}
								<ChevronDown />
							</div>
						</DropdownTrigger>

						<HeaderOrganizationList account={data.viewer} />
					</Dropdown>
				</NavbarBrand>

				<NavbarContent justify="end">
					<AuthNavigation rootQuery={data.viewer} />
				</NavbarContent>
			</Navbar>
		</>
	);
}
