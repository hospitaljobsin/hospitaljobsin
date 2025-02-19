/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import { graphql, useFragment } from "react-relay";
import type { OrganizationSettingsTabFragment$key } from "./__generated__/OrganizationSettingsTabFragment.graphql";

const OrganizationSettingsTabFragment = graphql`
 fragment OrganizationSettingsTabFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        organization(slug: $slug) {
            __typename
        }
  }
`;

export default function OrganizationSettingsTab(props: {
	rootQuery: OrganizationSettingsTabFragment$key;
}) {
	const query = useFragment(OrganizationSettingsTabFragment, props.rootQuery);

	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			organization settings tab
		</div>
	);
}
