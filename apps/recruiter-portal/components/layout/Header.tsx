"use client";
import type { HeaderQuery as HeaderQueryType } from "@/__generated__/HeaderQuery.graphql";
import { APP_NAME } from "@/lib/constants";
import links from "@/lib/links";
import { Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import AuthNavigation from "./AuthNavigation";

const HeaderQuery = graphql`
  query HeaderQuery {
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

export default function Header() {
	const data = useLazyLoadQuery<HeaderQueryType>(HeaderQuery, {});
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);
	return (
		<Navbar maxWidth="lg" isBordered>
			<NavbarBrand className="flex items-center gap-4">
				<Building2 />
				<Link href={links.dashboard} className="font-medium text-inherit">
					{APP_NAME}
				</Link>
			</NavbarBrand>

			<NavbarContent justify="end">
				<AuthNavigation rootQuery={data.viewer} />
			</NavbarContent>
		</Navbar>
	);
}
