"use client";
import type { SearchHeaderFragment$key } from "@/__generated__/SearchHeaderFragment.graphql";
import IncompleteProfileBanner from "@/components/layout/IncompleteProfileBanner";
import { APP_NAME } from "@/lib/constants";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import {
	Button,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@heroui/react";
import { ExternalLinkIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import JobSearchAutocomplete from "../forms/JobSearchAutocomplete";
import Logo from "../Logo";
import AuthNavigation from "../layout/AuthNavigation";

export const SearchHeaderFragment = graphql`
  fragment SearchHeaderFragment on Query {
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

export default function SearchHeader({
	query,
	searchTerm,
	setSearchTerm,
}: {
	query: SearchHeaderFragment$key;
	searchTerm: string;
	setSearchTerm: (value: string) => void;
}) {
	const data = useFragment(SearchHeaderFragment, query);

	return (
		<div className={"w-full flex flex-col sticky top-0 z-50"}>
			{data.viewer.__typename === "Account" && (
				<IncompleteProfileBanner account={data.viewer} animate={false} />
			)}
			<Navbar
				maxWidth="xl"
				isBordered
				position="static"
				classNames={{
					base: "bg-background-600",
					brand: "basis-auto flex-shrink-0",
					content:
						"data-[justify-center]:flex-1 data-[justify-center]:w-full data-[justify-center]:flex data-[justify-center]:justify-center data-[justify-end]:basis-auto data-[justify-end]:flex-shrink-0",
				}}
				isBlurred={false}
			>
				<NavbarContent justify="center" className="flex-1 w-full flex gap-12">
					<NavbarBrand
						className={"flex items-center gap-4 text-foreground-500"}
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
					<NavbarItem className="w-full">
						<JobSearchAutocomplete
							value={searchTerm}
							onChange={(value) => setSearchTerm(value)}
							onValueChange={(value) => setSearchTerm(value)}
							placeholder="Search by speciality, keyword or company"
							startContent={
								<SearchIcon size={16} className="text-foreground-500" />
							}
							classNames={{
								base: "hidden lg:block w-full",
								inputWrapper: "bg-background",
							}}
							autoComplete="off"
							onClear={() => setSearchTerm("")}
						/>
					</NavbarItem>
					{data.viewer.__typename === "Account" ? (
						<div className="flex items-center gap-2">
							<NavbarItem className="hidden md:block">
								<Link
									href={env.NEXT_PUBLIC_RECRUITER_PORTAL_BASE_URL}
									target="_blank"
									rel="noopener noreferrer"
									color="foreground"
									className={"text-foreground flex items-center gap-2"}
								>
									For Recruiters <ExternalLinkIcon className="w-4 h-4" />
								</Link>
							</NavbarItem>
							<AuthNavigation rootQuery={data.viewer} />
						</div>
					) : (
						<div className="flex items-center gap-2 sm:gap-4">
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
									className="text-base"
									variant="flat"
								>
									For Recruiters
								</Button>
							</NavbarItem>
						</div>
					)}
				</NavbarContent>
			</Navbar>
		</div>
	);
}
