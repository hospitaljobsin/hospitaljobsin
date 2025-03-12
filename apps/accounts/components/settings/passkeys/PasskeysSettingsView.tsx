"use client";
import type { PasskeysSettingsViewQuery as PasskeysSettingsViewQueryType } from "@/__generated__/PasskeysSettingsViewQuery.graphql";
import { LEARN_MORE_ABOUT_PASSKEYS_LINK } from "@/lib/constants";
import { Link } from "@heroui/react";
import { Suspense } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import invariant from "tiny-invariant";
import PasskeysList from "./PasskeysList";
import PasskeysListSkeleton from "./PasskeysListSkeleton";

const PasskeysSettingsViewQuery = graphql`
  query PasskeysSettingsViewQuery {
    viewer {
      __typename
      ... on Account {
        ...PasskeysListFragment
      }
    }
  }
`;

export default function PasskeysSettingsView() {
	const data = useLazyLoadQuery<PasskeysSettingsViewQueryType>(
		PasskeysSettingsViewQuery,
		{},
	);
	invariant(
		data.viewer.__typename === "Account",
		"Expected 'Account' node type",
	);

	return (
		<div className="w-full h-full space-y-12">
			<div className="w-full flex flex-col gap-4">
				<h2 className="text-lg">Passkeys</h2>
				<p className="text-foreground-400">
					Passkeys are webauthn credentials that validate your identity using
					touch, facial recognition, a device password, or a PIN.{" "}
					<Link isExternal showAnchorIcon href={LEARN_MORE_ABOUT_PASSKEYS_LINK}>
						Learn more about passkeys
					</Link>
				</p>
			</div>
			<Suspense fallback={<PasskeysListSkeleton />}>
				<PasskeysList root={data.viewer} />
			</Suspense>
		</div>
	);
}
