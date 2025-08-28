/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { OrganizationMembersTabFragment$key } from "@/__generated__/OrganizationMembersTabFragment.graphql";
import OrgDetailHeader from "@/components/layout/OrgDetailHeader";
import { graphql, useFragment } from "react-relay";
import OrganizationMembersList from "./OrganizationMembersList";

const OrganizationMembersTabFragment = graphql`
 fragment OrganizationMembersTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
		...OrgDetailHeaderFragment @arguments(slug: $slug)
        ...OrganizationMembersListFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationMembersTab(props: {
	rootQuery: OrganizationMembersTabFragment$key;
}) {
	const query = useFragment(OrganizationMembersTabFragment, props.rootQuery);

	return (
		<div className="w-full flex flex-col flex-1">
			<OrgDetailHeader root={query} />
			<div className="w-full mx-auto bg-background-600">
				<div className="w-full px-5 max-w-7xl mx-auto">
					<div className="py-8 w-full h-full flex flex-col items-center gap-12">
						<OrganizationMembersList rootQuery={query} />
					</div>
				</div>
			</div>
		</div>
	);
}
