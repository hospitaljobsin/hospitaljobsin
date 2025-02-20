"use client";
import { APP_NAME } from "@/lib/constants";
import links from "@/lib/links";
import {
	Button,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@heroui/react";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import AuthDropdown from "./AuthNavigation";
import type { HeaderQuery as HeaderQueryType } from "./__generated__/HeaderQuery.graphql";

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
	return (
		<Navbar maxWidth="lg" isBordered>
			<NavbarBrand>
				<Link href="/" className="font-medium text-inherit">
					{APP_NAME}
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
								href={links.login(window.location.href)}
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
	);
}
