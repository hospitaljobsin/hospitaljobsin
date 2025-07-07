"use client";
import type { DashboardHeaderQuery as DashboardHeaderQueryType } from "@/__generated__/DashboardHeaderQuery.graphql";
import IncompleteProfileBanner from "@/components/layout/IncompleteProfileBanner";
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
import AuthNavigation from "./AuthNavigation";

export const DashboardHeaderQuery = graphql`
  query DashboardHeaderQuery {
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

export default function DashboardHeader({
	queryReference,
}: {
	queryReference: PreloadedQuery<DashboardHeaderQueryType>;
}) {
	const data = usePreloadedQuery(DashboardHeaderQuery, queryReference);
	const [searchTerm, setSearchTerm] = useState("");
	const router = useRouter();

	return (
		<div className={"w-full flex flex-col sticky top-0 z-50"}>
			{data.viewer.__typename === "Account" && (
				<IncompleteProfileBanner account={data.viewer} />
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
				<NavbarContent justify="center" className="flex-1 w-full flex gap-6">
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
						<Input
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Search by speciality (e.g. Cardiology)"
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
							<AuthNavigation rootQuery={data.viewer} />
						</div>
					) : (
						<div className="flex items-center gap-2">
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
