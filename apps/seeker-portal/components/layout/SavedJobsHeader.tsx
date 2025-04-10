"use client";
import type { SavedJobsHeaderQuery as SavedJobsHeaderQueryType } from "@/__generated__/SavedJobsHeaderQuery.graphql";
import { env } from "@/lib/env";
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
import Logo from "../Logo";
import AuthNavigation from "./AuthNavigation";

const SavedJobsHeaderQuery = graphql`
  query SavedJobsHeaderQuery {
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

export default function SavedJobsHeader() {
	const data = useLazyLoadQuery<SavedJobsHeaderQueryType>(
		SavedJobsHeaderQuery,
		{},
	);
	return (
		<Navbar maxWidth="lg" isBordered>
			<NavbarBrand className="flex items-center gap-4">
				<Link href={links.landing} className="font-medium text-inherit">
					<Logo />
				</Link>
				Saved Jobs
			</NavbarBrand>

			<NavbarContent justify="end">
				{data.viewer.__typename === "Account" ? (
					<AuthNavigation rootQuery={data.viewer} />
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
	);
}
