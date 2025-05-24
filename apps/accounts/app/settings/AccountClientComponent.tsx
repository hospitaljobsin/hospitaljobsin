"use client";
import type { PreloadedQuery } from "react-relay";
import { useFragment, usePreloadedQuery } from "react-relay";
import { graphql } from "relay-runtime";
import type { AccountClientComponentFragment$key } from "@/__generated__/AccountClientComponentFragment.graphql";
import type { pageAccountSettingsQuery } from "@/__generated__/pageAccountSettingsQuery.graphql";
import AccountSettingsView from "@/components/settings/account/AccountSettingsView";
import { AccountSettingsPageQuery } from "./page";

const AccountClientComponentFragment = graphql`
  fragment AccountClientComponentFragment on Query {
    ...AccountSettingsViewFragment
  }
`;

export default function AccountClientComponent({
	queryReference,
}: {
	queryReference: PreloadedQuery<pageAccountSettingsQuery>;
}) {
	const data = usePreloadedQuery(AccountSettingsPageQuery, queryReference);
	const query = useFragment<AccountClientComponentFragment$key>(
		AccountClientComponentFragment,
		data,
	);
	return <AccountSettingsView query={query} />;
}
