/* eslint-disable relay/must-colocate-fragment-spreads */
"use client";
import { graphql } from "react-relay";

const GeneralSettingsViewFragment = graphql`
 fragment GeneralSettingsViewFragment on Query @argumentDefinitions(
      slug: {
        type: "String!",
      }
    ) {
        ...OrganizationDetailsFragment @arguments(slug: $slug)
  }
`;

export default function GeneralSettingsView() {
	return (
		<div className="py-8 w-full h-full flex flex-col items-center gap-12">
			general settings
		</div>
	);
}
