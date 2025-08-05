import type { PrivacyClientComponentQuery as PrivacyClientComponentQueryType } from "@/__generated__/PrivacyClientComponentQuery.graphql";
import PrivacyClientComponentQuery from "@/__generated__/PrivacyClientComponentQuery.graphql";
import type { PrivacySettingsViewFragment$key } from "@/__generated__/PrivacySettingsViewFragment.graphql";
import type { PreloadedQuery } from "react-relay";
import { useFragment, usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import invariant from "tiny-invariant";
import PrivacySettings from "./PrivacySettings";

const PrivacySettingsViewFragment = graphql`
  fragment PrivacySettingsViewFragment on Query {
    viewer {
      __typename
      ... on Account {
        ...PrivacySettingsFragment
      }
    }
  }
`;

export default function PrivacySettingsView({
	queryReference,
}: {
	queryReference: PreloadedQuery<PrivacyClientComponentQueryType>;
}) {
	const query = usePreloadedQuery(PrivacyClientComponentQuery, queryReference);
	const data = useFragment<PrivacySettingsViewFragment$key>(
		PrivacySettingsViewFragment,
		query,
	);
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	return (
		<div className="w-full h-full space-y-6">
			<PrivacySettings root={data.viewer} />
		</div>
	);
}
