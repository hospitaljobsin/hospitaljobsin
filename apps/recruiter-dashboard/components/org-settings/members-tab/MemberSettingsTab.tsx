/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { MemberSettingsTabFragment$key } from "@/__generated__/MemberSettingsTabFragment.graphql";
import PageOrganizationMemberSettingsQuery, {
	type pageOrganizationMemberSettingsQuery,
} from "@/__generated__/pageOrganizationMemberSettingsQuery.graphql";
import NotFoundView from "@/components/NotFoundView";
import { useState } from "react";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import invariant from "tiny-invariant";
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
		organization(slug: $slug) {
			__typename
			... on Organization {
				isMember
				...OrganizationMembersListFragment @arguments(searchTerm: $searchTerm)
				...OrganizationMembersControllerFragment
			}
		}
		viewer {
			__typename
			... on Account {
				...OrganizationMembersListAccountFragment
			}
		}
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

	if (
		query.organization.__typename !== "Organization" ||
		!query.organization.isMember
	) {
		return <NotFoundView />;
	}

	invariant(
		query.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	return (
		<div className="w-full h-full flex flex-col items-center gap-12">
			<OrganizationMembersController
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				organization={query.organization}
			/>
			<OrganizationMembersList
				organization={query.organization}
				account={query.viewer}
				searchTerm={searchTerm}
			/>
		</div>
	);
}
