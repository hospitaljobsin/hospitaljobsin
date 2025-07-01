"use client";
import type { HeaderQuery as HeaderQueryType } from "@/__generated__/HeaderQuery.graphql";
import { APP_NAME } from "@/lib/constants";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import {
	Button,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	cn,
} from "@heroui/react";
import Link from "next/link";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import Logo from "../Logo";
import AuthNavigation from "./AuthNavigation";
import IncompleteProfileBanner from "./IncompleteProfileBanner";

export const HeaderQuery = graphql`
  query HeaderQuery {
    viewer {
      ... on Account {
        __typename
        ...AuthNavigationFragment
		...IncompleteProfileBannerFragment
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
		<div
			className={cn(
				"w-full flex flex-col",
				variant !== "hero" && "sticky top-0 z-50",
			)}
		>
			{data.viewer.__typename === "Account" && (
				<IncompleteProfileBanner account={data.viewer} />
			)}
			<Navbar
				maxWidth="xl"
				isBordered={variant !== "hero"}
				position="static"
				classNames={{
					base:
						variant === "hero"
							? "bg-transparent text-primary-foreground"
							: "bg-background-600",
				}}
				isBlurred={false}
			>
				<NavbarBrand
					className={cn(
						"flex items-center gap-4",
						variant === "hero" ? "" : "text-foreground-500",
					)}
				>
					<Link
						href={links.landing}
						className="font-medium text-inherit flex items-center gap-4"
					>
						<Logo />{" "}
						<span className="font-medium text-inherit sm:flex items-center gap-4 hidden">
							{APP_NAME}
						</span>
					</Link>
				</NavbarBrand>

				<NavbarContent justify="end">
					{data.viewer.__typename === "Account" ? (
						<>
							<NavbarItem className="hidden md:block">
								<Link
									href={env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL}
									target="_blank"
									rel="noopener noreferrer"
									color="foreground"
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
		</div>
	);
}
