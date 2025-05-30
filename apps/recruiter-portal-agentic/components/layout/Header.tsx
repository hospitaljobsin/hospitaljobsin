"use client";
import { Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import Link from "next/link";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import type { HeaderQuery as HeaderQueryType } from "@/__generated__/HeaderQuery.graphql";
import { APP_NAME } from "@/lib/constants";
import links from "@/lib/links";
import Logo from "../Logo";
import AuthNavigation from "./AuthNavigation";

export const HeaderQuery = graphql`
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
	return (
		<Navbar maxWidth="lg" isBordered>
			<NavbarBrand className="flex items-center gap-4">
				<Link href={links.dashboard} className="font-medium text-inherit">
					<Logo />
				</Link>
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
