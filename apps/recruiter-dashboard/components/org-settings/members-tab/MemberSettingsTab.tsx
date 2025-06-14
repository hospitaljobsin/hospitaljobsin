/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { MemberSettingsTabFragment$key } from "@/__generated__/MemberSettingsTabFragment.graphql";
import PageOrganizationMemberSettingsQuery, {
	type pageOrganizationMemberSettingsQuery,
} from "@/__generated__/pageOrganizationMemberSettingsQuery.graphql";
import { useState } from "react";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import OrganizationMembersController from "./OrganizationMembersController";
import OrganizationMembersList from "./OrganizationMembersList";

const MemberSettingsTabFragment = graphql`
 fragment MemberSettingsTabFragment on Query @argumentDefinitions(
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

export default function MemberSettingsTab(props: {
	initialQueryRef: PreloadedQuery<pageOrganizationMemberSettingsQuery>;
}) {
	const [searchTerm, setSearchTerm] = useState<string | null>(null);
	const data = usePreloadedQuery(
		PageOrganizationMemberSettingsQuery,
		props.initialQueryRef,
	);
	const query = useFragment<MemberSettingsTabFragment$key>(
		MemberSettingsTabFragment,
		data,
	);

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
