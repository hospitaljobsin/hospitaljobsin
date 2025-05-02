"use client";
import type { OrgDetailHeaderOrganizationFragment$key } from "@/__generated__/OrgDetailHeaderOrganizationFragment.graphql";
import type { OrgDetailHeaderQueryFragment$key } from "@/__generated__/OrgDetailHeaderQueryFragment.graphql";
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
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import Logo from "../Logo";
import OrganizationTabs from "../organization-detail/OrganizationTabs";
import AuthDropdown from "./AuthNavigation";

const OrgDetailHeaderQueryFragment = graphql`
  fragment OrgDetailHeaderQueryFragment on Query {
	viewer {
		__typename
		... on Account {
			...AuthNavigationFragment
		}
		... on NotAuthenticatedError {
			__typename
		}
	}
  }
`;

const OrgDetailHeaderOrganizationFragment = graphql`
  fragment OrgDetailHeaderOrganizationFragment on Organization {
	name
  }
`;

export default function OrgDetailHeader({
	organization,
	query,
}: {
	organization: OrgDetailHeaderOrganizationFragment$key;
	query: OrgDetailHeaderQueryFragment$key;
}) {
	const slug = useParams<{ slug: string }>().slug;
	const data = useFragment(OrgDetailHeaderQueryFragment, query);
	const organizationData = useFragment(
		OrgDetailHeaderOrganizationFragment,
		organization,
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
						{organizationData.name}
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
