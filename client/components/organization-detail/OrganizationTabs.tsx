import links from "@/lib/links";
import { Tab, Tabs } from "@heroui/react";
import { HomeIcon, UserIcon } from "lucide-react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import type { OrganizationTabsFragment$key } from "./__generated__/OrganizationTabsFragment.graphql";

const OrganizationTabsFragment = graphql`
 fragment OrganizationTabsFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        organization(slug: $slug) {
            __typename
            ... on Organization {
                slug
            }
        }}
`;

export default function OrganizationTabs(props: {
	rootQuery: OrganizationTabsFragment$key;
}) {
	const data = useFragment(OrganizationTabsFragment, props.rootQuery);
	invariant(
		data.organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);
	return (
		<div className="flex w-full flex-col border-b border-gray-300 py-4">
			<Tabs
				aria-label="Organization Detail Menu"
				color="default"
				variant="light"
			>
				<Tab
					key="overview"
					href={links.organizationDetail(data.organization.slug)}
					title={
						<div className="flex items-center space-x-2">
							<HomeIcon />
							<span>Overview</span>
						</div>
					}
				/>
				<Tab
					key="members"
					href={links.organizationDetailMembers(data.organization.slug)}
					title={
						<div className="flex items-center space-x-2">
							<UserIcon />
							<span>Members</span>
						</div>
					}
				/>
			</Tabs>
		</div>
	);
}
