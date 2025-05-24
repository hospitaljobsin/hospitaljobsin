"use client";
import type { PreloadedQuery } from "react-relay";
import { useFragment, usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import type { PasskeysClientComponentFragment$key } from "@/__generated__/PasskeysClientComponentFragment.graphql";
import type { pagePasskeysSettingsQuery } from "@/__generated__/pagePasskeysSettingsQuery.graphql";
import PasskeysSettingsView from "@/components/settings/passkeys/PasskeysSettingsView";
import { PasskeysSettingsPageQuery } from "./page";

const PasskeysClientComponentFragment = graphql`
  fragment PasskeysClientComponentFragment on Query {
    ...PasskeysSettingsViewFragment
  }
`;

export default function PasskeysClientComponent({
	queryReference,
}: {
	queryReference: PreloadedQuery<pagePasskeysSettingsQuery>;
}) {
	const data = usePreloadedQuery(PasskeysSettingsPageQuery, queryReference);
	const query = useFragment<PasskeysClientComponentFragment$key>(
		PasskeysClientComponentFragment,
		data,
	);
	return <PasskeysSettingsView query={query} />;
}
