import links from "@/lib/links";
import { Tab, Tabs } from "@heroui/react";
import { HomeIcon, Settings, UserIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
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
				isAdmin
            }
        }}
`;

export default function OrganizationTabs(props: {
	rootQuery: OrganizationTabsFragment$key;
	slug: string;
}) {
	const pathnname = usePathname();
	const params = useParams<{ slug: string }>();
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
				selectedKey={pathnname}
			>
				<Tab
					key={links.organizationDetail(params.slug)}
					href={links.organizationDetail(params.slug)}
					title={
						<div className="flex items-center space-x-2">
							<HomeIcon />
							<span>Overview</span>
						</div>
					}
				/>
				<Tab
					key={links.organizationDetailMembers(params.slug)}
					href={links.organizationDetailMembers(params.slug)}
					title={
						<div className="flex items-center space-x-2">
							<UserIcon />
							<span>Members</span>
						</div>
					}
				/>
				{data.organization.isAdmin && (
					<Tab
						key={links.organizationDetailSettings(params.slug)}
						href={links.organizationDetailSettings(params.slug)}
						title={
							<div className="flex items-center space-x-2">
								<Settings />
								<span>Settings</span>
							</div>
						}
					/>
				)}
			</Tabs>
		</div>
	);
}
