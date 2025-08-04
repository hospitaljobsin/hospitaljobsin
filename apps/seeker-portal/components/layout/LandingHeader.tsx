"use client";
import type { LandingHeaderFragment$key } from "@/__generated__/LandingHeaderFragment.graphql";
import { APP_NAME, WHATSAPP_CHANNEL_LINK } from "@/lib/constants";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import {
	Button,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Tooltip,
	cn,
} from "@heroui/react";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { WhatsappIcon } from "../icons";
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
			{data.viewer.__typename === "Account" ? (
				<IncompleteProfileBanner account={data.viewer} />
			) : null}
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
						<Logo variant="hero" />{" "}
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
									className={"text-primary-foreground flex items-center gap-2"}
								>
									For Recruiters <ExternalLinkIcon className="w-4 h-4" />
								</Link>
							</NavbarItem>
							<NavbarItem>
								<Tooltip
									content="Get job alerts on WhatsApp"
									placement="bottom"
								>
									<Link href={WHATSAPP_CHANNEL_LINK} target="_blank">
										<WhatsappIcon
											className="w-7 h-7 text-primary-foreground"
											size={10}
										/>
									</Link>
								</Tooltip>
							</NavbarItem>
							<AuthNavigation rootQuery={data.viewer} />
						</>
					) : (
						<>
							<NavbarItem>
								<Button
									as={Link}
									color="secondary"
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
