"use client";
import type { OrgDetailHeaderFragment$key } from "@/__generated__/OrgDetailHeaderFragment.graphql";
import { APP_NAME } from "@/lib/constants";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import {
	Button,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@heroui/react";
import { ExternalLinkIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import Logo from "../Logo";
import JobSearchAutocomplete from "../forms/JobSearchAutocomplete";
import OrganizationTabs from "../organization-detail/OrganizationTabs";
import AuthDropdown from "./AuthNavigation";
import IncompleteProfileBanner from "./IncompleteProfileBanner";

export const OrgDetailHeaderFragment = graphql`
  fragment OrgDetailHeaderFragment on Query   @argumentDefinitions(
    slug: { type: "String!" }
  ) {
	viewer {
		__typename
		... on Account {
			...AuthNavigationFragment
			...IncompleteProfileBannerFragment
		}
		... on NotAuthenticatedError {
			__typename
		}
	}
	organization(slug: $slug) {
		__typename
		... on Organization {
			name
			slug
		}
	}
  }
`;

export default function OrgDetailHeader({
	root,
}: {
	root: OrgDetailHeaderFragment$key;
}) {
	const data = useFragment(OrgDetailHeaderFragment, root);
	const router = useRouter();
	const [searchValue, setSearchValue] = useState("");

	const handleSearchSubmit = (searchTerm: string) => {
		// Navigate to search with the search term
		const params = new URLSearchParams({
			q: searchTerm.trim(),
		});
		router.push(`${links.search()}?${params.toString()}`);
	};

	return (
		<div className="w-full flex flex-col bg-background-600 border-b border-foreground-300 sticky top-0 z-50">
			{data.viewer.__typename === "Account" && (
				<IncompleteProfileBanner account={data.viewer} animate={false} />
			)}
			<Navbar maxWidth="xl" className="bg-background-600">
				<NavbarContent justify="center" className="flex-1 w-full flex gap-6">
					<NavbarBrand className="flex items-center gap-4 text-foreground-500">
						<Link href={links.landing} className="font-medium text-inherit">
							<Logo />
						</Link>
						{data.organization.__typename === "Organization" ? (
							<Link
								href={links.organizationDetail(data.organization.slug)}
								className="font-medium text-inherit truncate max-w-32 sm:max-w-xs flex-1 hidden sm:block"
							>
								{data.organization.name}
							</Link>
						) : (
							<Link
								href={links.landing}
								className="font-medium text-inherit truncate max-w-32 sm:max-w-xs flex-1 hidden sm:block"
							>
								{APP_NAME}
							</Link>
						)}
					</NavbarBrand>
					<NavbarItem className="w-full">
						<JobSearchAutocomplete
							value={searchValue}
							onValueChange={setSearchValue}
							onSubmit={handleSearchSubmit}
							onJobSelect={(job) => {
								setSearchValue(job.displayName);
								handleSearchSubmit(job.displayName);
							}}
							placeholder="Search by Speciality or keyword"
							startContent={
								<SearchIcon size={16} className="text-foreground-500" />
							}
							fullWidth
							variant="bordered"
							className="hidden lg:block"
							inputProps={{
								classNames: {
									inputWrapper: "bg-background",
								},
							}}
							autoComplete="off"
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
							<NavbarItem>
								<Button
									isIconOnly
									variant="light"
									size="sm"
									className="block sm:hidden mt-2 text-foreground-500"
									as={Link}
									href={links.search()}
								>
									<SearchIcon />
								</Button>
							</NavbarItem>

							<AuthDropdown rootQuery={data.viewer} />
						</div>
					) : (
						<>
							<NavbarItem>
								<Button
									as={Link}
									color="primary"
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
			{data.organization.__typename === "Organization" && (
				<div className="w-full max-w-7xl mx-auto flex items-center justify-between">
					<OrganizationTabs />
				</div>
			)}
		</div>
	);
}
