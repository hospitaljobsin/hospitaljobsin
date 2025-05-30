"use client";
import type { HeaderQuery as HeaderQueryType } from "@/__generated__/HeaderQuery.graphql";
import links from "@/lib/links";
import { Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import AuthNavigation from "./AuthNavigation";

export const HeaderQuery = graphql`
  query HeaderQuery($organizationSlug: String!) {
    viewer {
      ... on Account {
        __typename
        ...AuthNavigationFragment
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
		<Navbar maxWidth="lg" isBordered>
			<NavbarBrand className="flex items-center gap-4">
				<div className="relative h-8 w-8">
					<Image
						src={data.organization.logoUrl}
						alt="Organization Logo"
						fill
						className="rounded-md object-cover"
					/>
				</div>
				<Link
					href={links.organizationDetail(data.organization.slug)}
					className="font-medium text-inherit"
				>
					{data.organization.name}
				</Link>
				<ChevronDown />
			</NavbarBrand>

			<NavbarContent justify="end">
				<AuthNavigation rootQuery={data.viewer} />
			</NavbarContent>
		</Navbar>
	);
}
