/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { OrganizationInvitesViewFragment$key } from "@/__generated__/OrganizationInvitesViewFragment.graphql";
import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import OrganizationInvitesController from "./OrganizationInvitesController";
import OrganizationInvitesList from "./OrganizationInvitesList";

const OrganizationInvitesViewFragment = graphql`
 fragment OrganizationInvitesViewFragment on Query @argumentDefinitions(
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

export default function OrganizationInvitesView(props: {
	rootQuery: OrganizationInvitesViewFragment$key;
}) {
	const [searchTerm, setSearchTerm] = useState<string | null>(null);
	const query = useFragment(OrganizationInvitesViewFragment, props.rootQuery);

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
