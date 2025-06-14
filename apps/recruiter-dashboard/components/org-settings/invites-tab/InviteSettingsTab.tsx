"use client";
import type { InviteSettingsTabFragment$key } from "@/__generated__/InviteSettingsTabFragment.graphql";
import PageOrganizationInviteSettingsQuery, {
	type pageOrganizationInviteSettingsQuery,
} from "@/__generated__/pageOrganizationInviteSettingsQuery.graphql";
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
        ...OrganizationInvitesListFragment @arguments(slug: $slug, searchTerm: $searchTerm)
        ...OrganizationInvitesControllerFragment @arguments(slug: $slug)
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

	return (
		<div className="w-full h-full flex flex-col items-center gap-12">
			<OrganizationInvitesController
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				rootQuery={query}
			/>
			<OrganizationInvitesList rootQuery={query} searchTerm={searchTerm} />
		</div>
	);
}
