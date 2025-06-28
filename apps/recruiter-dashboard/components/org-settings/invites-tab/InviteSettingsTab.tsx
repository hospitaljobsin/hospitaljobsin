"use client";
import type { InviteSettingsTabFragment$key } from "@/__generated__/InviteSettingsTabFragment.graphql";
import PageOrganizationInviteSettingsQuery, {
	type pageOrganizationInviteSettingsQuery,
} from "@/__generated__/pageOrganizationInviteSettingsQuery.graphql";
import NotFoundView from "@/components/NotFoundView";
import { useState } from "react";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import OrganizationInvitesController from "./OrganizationInvitesController";
import OrganizationInvitesList from "./OrganizationInvitesList";

const InviteSettingsTabFragment = graphql`
 fragment InviteSettingsTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      },
      searchTerm: {
        type: "String",
        defaultValue: null
      }
    ) {
		organization(slug: $slug) {
            __typename
            ... on Organization {
				isAdmin
            ...OrganizationInvitesControllerFragment
			...OrganizationInvitesListFragment @arguments(searchTerm: $searchTerm)
            }
        }
  }
`;

export default function InviteSettingsTab(props: {
	initialQueryRef: PreloadedQuery<pageOrganizationInviteSettingsQuery>;
}) {
	const [searchTerm, setSearchTerm] = useState<string | null>(null);
	const data = usePreloadedQuery(
		PageOrganizationInviteSettingsQuery,
		props.initialQueryRef,
	);
	const query = useFragment<InviteSettingsTabFragment$key>(
		InviteSettingsTabFragment,
		data,
	);

	if (
		query.organization.__typename !== "Organization" ||
		!query.organization.isAdmin
	) {
		return <NotFoundView />;
	}

	return (
		<div className="w-full h-full flex flex-col items-center gap-12">
			<OrganizationInvitesController
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				organization={query.organization}
			/>
			<OrganizationInvitesList
				organization={query.organization}
				searchTerm={searchTerm}
			/>
		</div>
	);
}
