"use client";
import type { SearchHeaderQuery as SearchHeaderQueryType } from "@/__generated__/SearchHeaderQuery.graphql";
import IncompleteProfileBanner from "@/components/layout/IncompleteProfileBanner";
import { APP_NAME } from "@/lib/constants";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import {
	Button,
	Input,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@heroui/react";
import Link from "next/link";
import { parseAsString, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import { useDebounce } from "use-debounce";
import Logo from "../Logo";
import AuthNavigation from "../layout/AuthNavigation";

export const SearchHeaderQuery = graphql`
  query SearchHeaderQuery {
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
	queryReference,
}: {
	queryReference: PreloadedQuery<SearchHeaderQueryType>;
}) {
	const data = usePreloadedQuery(SearchHeaderQuery, queryReference);

	// nuqs state for speciality filter
	const [filters, setFilters] = useQueryStates({
		speciality: parseAsString.withDefault(""),
	});

	const [searchTerm, setSearchTerm] = useState(filters.speciality);
	const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

	// Update filters when debouncedSearchTerm changes
	useEffect(() => {
		if (debouncedSearchTerm !== filters.speciality) {
			setFilters({ speciality: debouncedSearchTerm });
		}
	}, [debouncedSearchTerm, setFilters, filters.speciality]);

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
				{/* Centered search input */}
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
						<Input
							id="speciality"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Search speciality (e.g. Cardiology)"
							fullWidth
							variant="bordered"
							classNames={{
								inputWrapper: "bg-background",
							}}
							autoComplete="off"
							isClearable
							onClear={() => setSearchTerm("")}
						/>
					</NavbarItem>
					{data.viewer.__typename === "Account" ? (
						<>
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
