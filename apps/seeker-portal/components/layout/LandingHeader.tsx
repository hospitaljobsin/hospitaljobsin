"use client";
import { LandingHeaderFragment$key } from "@/__generated__/LandingHeaderFragment.graphql";
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
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import Logo from "../Logo";
import AuthNavigation from "./AuthNavigation";
import IncompleteProfileBanner from "./IncompleteProfileBanner";

export const LandingHeaderFragment = graphql`
  fragment LandingHeaderFragment on Query {
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

export default function LandingHeader({
	rootQuery,
}: {
	rootQuery: LandingHeaderFragment$key;
}) {
	const data = useFragment(LandingHeaderFragment, rootQuery);
	return (
		<div className={cn("w-full flex flex-col static top-0 z-50")}>
			{data.viewer.__typename === "Account" && (
				<IncompleteProfileBanner account={data.viewer} />
			)}
			<Navbar
				maxWidth="xl"
				isBordered={false}
				position="static"
				classNames={{
					base: "bg-transparent text-primary-foreground",
				}}
				isBlurred={false}
			>
				<NavbarBrand className={cn("flex items-center gap-4")}>
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
									className={"text-primary-foreground"}
								>
									For Recruiters
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
									For Recruiters
								</Button>
							</NavbarItem>
						</>
					)}
				</NavbarContent>
			</Navbar>
		</div>
	);
}
