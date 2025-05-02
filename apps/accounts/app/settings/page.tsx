"use client";
import type { pageAccountSettingsQuery } from "@/__generated__/pageAccountSettingsQuery.graphql";
import AccountSettingsViewSkeleton from "@/components/settings/account/AccountSettingsViewSkeleton";
import { getCurrentEnvironment } from "@/lib/relay/environments";
import { Suspense } from "react";
import { loadQuery } from "react-relay";
import { graphql } from "relay-runtime";
import AccountClientComponent from "./AccountClientComponent";

export const AccountSettingsPageQuery = graphql`
	query pageAccountSettingsQuery {
		...AccountClientComponentFragment
	}
`;

export default function AccountSettingsPage() {
	const queryReference = loadQuery<pageAccountSettingsQuery>(
		getCurrentEnvironment(),
		AccountSettingsPageQuery,
		{},
		{ fetchPolicy: "store-or-network" },
	);

	return (
		<Suspense fallback={<AccountSettingsViewSkeleton />}>
			<AccountClientComponent queryReference={queryReference} />
		</Suspense>
	);
}
