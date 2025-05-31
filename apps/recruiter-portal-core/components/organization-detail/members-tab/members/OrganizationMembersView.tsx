/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import type { OrganizationMembersViewFragment$key } from "@/__generated__/OrganizationMembersViewFragment.graphql";
import OrganizationMembersController from "./OrganizationMembersController";
import OrganizationMembersList from "./OrganizationMembersList";

const OrganizationMembersViewFragment = graphql`
 fragment OrganizationMembersViewFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      },
	  searchTerm: {
		type: "String",
		defaultValue: null
	  }
    ) {
        ...OrganizationMembersListFragment @arguments(slug: $slug, searchTerm: $searchTerm)
		...OrganizationMembersControllerFragment @arguments(slug: $slug)
  }
`;

export default function OrganizationMembersView(props: {
	rootQuery: OrganizationMembersViewFragment$key;
}) {
	const [searchTerm, setSearchTerm] = useState<string | null>(null);
	const query = useFragment(OrganizationMembersViewFragment, props.rootQuery);

	return (
		<div className="w-full h-full flex flex-col items-center gap-12">
			<OrganizationMembersController
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				rootQuery={query}
			/>
			<OrganizationMembersList rootQuery={query} searchTerm={searchTerm} />
		</div>
	);
}
