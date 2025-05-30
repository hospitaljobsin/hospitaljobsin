"use client";
import type { HeaderQuery as HeaderQueryType } from "@/__generated__/HeaderQuery.graphql";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Navbar,
	NavbarBrand,
	NavbarContent,
} from "@heroui/react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import AuthNavigation from "./AuthNavigation";

export const HeaderQuery = graphql`
  query HeaderQuery($organizationSlug: String!) {
    viewer {
      ... on Account {
        __typename
        ...AuthNavigationFragment
      }
      ... on NotAuthenticatedError {
        __typename
      }
    }
	organization(slug: $organizationSlug) {
		__typename
		... on Organization {
			name
			slug
			logoUrl
		}
	}
  }
`;

export default function Header({
	queryReference,
}: {
	queryReference: PreloadedQuery<HeaderQueryType>;
}) {
	const data = usePreloadedQuery<HeaderQueryType>(HeaderQuery, queryReference);
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);
	invariant(
		data.organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);
	return (
		<Navbar maxWidth="lg" isBordered>
			<NavbarBrand>
				<Dropdown placement="bottom-end">
					<DropdownTrigger>
						<div className="flex items-center gap-4">
							<div className="relative h-8 w-8">
								<Image
									src={data.organization.logoUrl}
									alt="Organization Logo"
									fill
									className="rounded-md object-cover"
									sizes="20vw"
								/>
							</div>
							{data.organization.name}
							<ChevronDown />
						</div>
					</DropdownTrigger>

					<DropdownMenu
						aria-label="ACME features"
						itemClasses={{
							base: "gap-4",
						}}
					>
						<DropdownItem
							key="autoscaling"
							description="ACME scales apps based on demand and load"
						>
							Autoscaling
						</DropdownItem>
						<DropdownItem
							key="usage_metrics"
							description="Real-time metrics to debug issues"
						>
							Usage Metrics
						</DropdownItem>
						<DropdownItem
							key="production_ready"
							description="ACME runs on ACME, join us at web scale"
						>
							Production Ready
						</DropdownItem>
						<DropdownItem
							key="99_uptime"
							description="High availability and uptime guarantees"
						>
							+99% Uptime
						</DropdownItem>
						<DropdownItem
							key="supreme_support"
							description="Support team ready to respond"
						>
							+Supreme Support
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarBrand>

			<NavbarContent justify="end">
				<AuthNavigation rootQuery={data.viewer} />
			</NavbarContent>
		</Navbar>
	);
}
