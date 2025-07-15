"use client";
import type { OrgDetailHeaderQuery as OrgDetailHeaderQueryType } from "@/__generated__/OrgDetailHeaderQuery.graphql";
import { APP_NAME } from "@/lib/constants";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import {
	Button,
	Input,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@heroui/react";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import Logo from "../Logo";
import OrganizationTabs from "../organization-detail/OrganizationTabs";
import AuthDropdown from "./AuthNavigation";
import IncompleteProfileBanner from "./IncompleteProfileBanner";

export const OrgDetailHeaderQuery = graphql`
  query OrgDetailHeaderQuery($slug: String!) {
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
	queryReference,
}: {
	queryReference: PreloadedQuery<OrgDetailHeaderQueryType>;
}) {
	const data = usePreloadedQuery(OrgDetailHeaderQuery, queryReference);

	const [searchTerm, setSearchTerm] = useState("");

	const router = useRouter();

	return (
		<div className="w-full flex flex-col bg-background-600 border-b border-foreground-300 sticky top-0 z-50">
			{data.viewer.__typename === "Account" && (
				<IncompleteProfileBanner account={data.viewer} />
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
						<Input
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Search by speciality, keyword or company"
							startContent={
								<SearchIcon size={16} className="text-foreground-500" />
							}
							fullWidth
							variant="bordered"
							className="hidden lg:block"
							classNames={{
								inputWrapper: "bg-background",
							}}
							autoComplete="off"
							isClearable
							onClear={() => setSearchTerm("")}
							onKeyDown={(e) => {
								if (
									e.key === "Enter" &&
									!e.nativeEvent.isComposing &&
									searchTerm.trim() !== ""
								) {
									e.preventDefault();
									const params = new URLSearchParams({
										q: searchTerm.trim(),
									});
									router.push(`${links.search}?${params.toString()}`);
								}
							}}
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
									className={"text-foreground"}
								>
									For Recruiters
								</Link>
							</NavbarItem>
							<NavbarItem>
								<Button
									isIconOnly
									variant="light"
									size="sm"
									className="block sm:hidden mt-2 text-foreground-500"
									as={Link}
									href={links.search}
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
			{data.organization.__typename === "Organization" && (
				<div className="w-full max-w-7xl mx-auto flex items-center justify-between">
					<OrganizationTabs />
				</div>
			)}
		</div>
	);
}
