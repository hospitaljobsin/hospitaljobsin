"use client";
import type { OrgDetailHeaderQuery as OrgDetailHeaderQueryType } from "@/__generated__/OrgDetailHeaderQuery.graphql";
import { env } from "@/lib/env/client";
import links from "@/lib/links";
import {
	Button,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@heroui/react";
import { useParams } from "next/navigation";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import Logo from "../Logo";
import OrganizationTabs from "../organization-detail/OrganizationTabs";
import AuthDropdown from "./AuthNavigation";

const OrgDetailHeaderQuery = graphql`
  query OrgDetailHeaderQuery($slug: String!) {
    viewer {
      ... on Account {
        __typename
        ...AuthNavigationFragment
      }
      ... on NotAuthenticatedError {
        __typename
      }
    }

	organization(slug: $slug) {
		__typename
		... on Organization {
			name
		}
	}
  }
`;

export default function OrgDetailHeader() {
	const slug = useParams<{ slug: string }>().slug;
	const data = useLazyLoadQuery<OrgDetailHeaderQueryType>(
		OrgDetailHeaderQuery,
		{ slug: slug },
		{ fetchPolicy: "store-or-network" },
	);
	const organization = data.organization;
	invariant(
		organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);

	return (
		<div className="w-full flex flex-col bg-background border-b border-gray-300">
			<Navbar maxWidth="lg">
				<NavbarBrand className="flex items-center gap-4">
					<Link href={links.landing} className="font-medium text-inherit">
						<Logo />
					</Link>
					<Link
						href={links.organizationDetail(slug)}
						className="font-medium text-inherit"
					>
						{organization.name}
					</Link>
				</NavbarBrand>

				<NavbarContent justify="end">
					{data.viewer.__typename === "Account" ? (
						<AuthDropdown rootQuery={data.viewer} />
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
			<div className="w-full max-w-5xl mx-auto flex items-center justify-between">
				<OrganizationTabs />
			</div>
		</div>
	);
}
