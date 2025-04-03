/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import type { GeneralSettingsViewFragment$key } from "@/__generated__/GeneralSettingsViewFragment.graphql";
import { graphql, useFragment } from "react-relay";
import invariant from "tiny-invariant";
import UpdateOrganizationForm from "./UpdateOrganizationForm";

const GeneralSettingsViewFragment = graphql`
 fragment GeneralSettingsViewFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        organization(slug: $slug) {
            __typename
            ... on Organization {
                ...UpdateOrganizationFormFragment
            }
        }
        
  }
`;

export default function GeneralSettingsView({
	rootQuery,
}: {
	rootQuery: GeneralSettingsViewFragment$key;
}) {
	const data = useFragment(GeneralSettingsViewFragment, rootQuery);
	invariant(
		data.organization.__typename === "Organization",
		"Expected 'Organization' node type",
	);
	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			<UpdateOrganizationForm rootQuery={data.organization} />
		</div>
	);
}
