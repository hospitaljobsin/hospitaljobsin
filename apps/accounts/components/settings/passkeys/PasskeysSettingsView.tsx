"use client";
import PasskeysClientComponentQuery, {
	type PasskeysClientComponentQuery as PasskeysClientComponentQueryType,
} from "@/__generated__/PasskeysClientComponentQuery.graphql";
import type { PasskeysSettingsViewFragment$key } from "@/__generated__/PasskeysSettingsViewFragment.graphql";
import { LEARN_MORE_ABOUT_PASSKEYS_LINK } from "@/lib/constants";
import { Link } from "@heroui/react";
import {
	type PreloadedQuery,
	graphql,
	useFragment,
	usePreloadedQuery,
} from "react-relay";
import invariant from "tiny-invariant";
import PasskeysList from "./PasskeysList";

const PasskeysSettingsViewFragment = graphql`
  fragment PasskeysSettingsViewFragment on Query {
    viewer {
      __typename
      ... on Account {
        ...PasskeysListFragment
      }
    }
  }
`;

export default function PasskeysSettingsView({
	queryReference,
}: {
	queryReference: PreloadedQuery<PasskeysClientComponentQueryType>;
}) {
	const query = usePreloadedQuery(PasskeysClientComponentQuery, queryReference);
	const data = useFragment<PasskeysSettingsViewFragment$key>(
		PasskeysSettingsViewFragment,
		query,
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
			<PasskeysList root={data.viewer} />
		</div>
	);
}
