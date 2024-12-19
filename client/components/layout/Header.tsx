"use client";
import { APP_NAME } from "@/lib/constants";
import {
	Button,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@nextui-org/react";
import Link from "next/link";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import AuthDropdown from "./AuthDropdown";
import type { HeaderQuery as HeaderQueryType } from "./__generated__/HeaderQuery.graphql";

const HeaderQuery = graphql`
  query HeaderQuery {
    viewer {
      ... on Account {
        __typename
        ...AuthDropdownFragment
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
							<Link color="foreground" href="/auth/login">
								<Button color="default">Log In</Button>
							</Link>
						</NavbarItem>
						<NavbarItem>
							<Button color="default" variant="flat" disabled>
								For recruiters
							</Button>
						</NavbarItem>
					</>
				)}
			</NavbarContent>
		</Navbar>
	);
}
