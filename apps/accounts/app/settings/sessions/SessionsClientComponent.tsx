"use client";
import type { SessionsClientComponentFragment$key } from "@/__generated__/SessionsClientComponentFragment.graphql";
import type { pageSessionsSettingsQuery } from "@/__generated__/pageSessionsSettingsQuery.graphql";
import SessionsSettingsView from "@/components/settings/sessions/SessionsSettingsView";
import type { PreloadedQuery } from "react-relay";
import { useFragment, usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import { SessionsSettingsPageQuery } from "./page";

const SessionsClientComponentFragment = graphql`
  fragment SessionsClientComponentFragment on Query {
    ...SessionsSettingsViewFragment
  }
`;

export default function SessionsClientComponent({
	queryReference,
}: { queryReference: PreloadedQuery<pageSessionsSettingsQuery> }) {
	const data = usePreloadedQuery(SessionsSettingsPageQuery, queryReference);
	const query = useFragment<SessionsClientComponentFragment$key>(
		SessionsClientComponentFragment,
		data,
	);
	return <SessionsSettingsView query={query} />;
}
