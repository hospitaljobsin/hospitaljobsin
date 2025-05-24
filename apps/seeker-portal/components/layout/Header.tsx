"use client";
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
import type { HeaderQuery as HeaderQueryType } from "@/__generated__/HeaderQuery.graphql";
import { APP_NAME } from "@/lib/constants";
import { env } from "@/lib/env/client";
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
	variant,
	queryReference,
}: {
	variant: "hero" | "default";
	queryReference: PreloadedQuery<HeaderQueryType>;
}) {
	const data = usePreloadedQuery(HeaderQuery, queryReference);
	return (
		<Navbar
			maxWidth="lg"
			isBordered={variant !== "hero"}
			classNames={{
				base:
					variant === "hero"
						? "bg-primary-400 text-primary-foreground"
						: "bg-white",
			}}
			isBlurred={variant !== "hero"}
		>
			<NavbarBrand className="flex items-center gap-4">
				<Link
					href={links.landing}
					className="font-medium text-inherit flex items-center gap-4"
				>
					<Logo />
					{APP_NAME}
				</Link>
			</NavbarBrand>

			<NavbarContent justify="end">
				{data.viewer.__typename === "Account" ? (
					<>
						{" "}
						<NavbarItem className="hidden md:block">
							<Link
								href={env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL}
								isExternal
								color="foreground"
								showAnchorIcon
								className={
									variant === "hero"
										? "text-primary-foreground"
										: "text-foreground"
								}
							>
								for recruiters
							</Link>
						</NavbarItem>
						<AuthNavigation rootQuery={data.viewer} />
					</>
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
