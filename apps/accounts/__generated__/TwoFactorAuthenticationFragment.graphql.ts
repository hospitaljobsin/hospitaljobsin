/**
 * @generated SignedSource<<6eacd0c640a454bf3864c8aa5ac0a94e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from "relay-runtime";
export type TwoFactorProvider = "AUTHENTICATOR" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type TwoFactorAuthenticationFragment$data = {
	readonly has2faEnabled: boolean;
	readonly sudoModeExpiresAt: any | null | undefined;
	readonly twoFactorProviders: ReadonlyArray<TwoFactorProvider>;
	readonly " $fragmentType": "TwoFactorAuthenticationFragment";
};
export type TwoFactorAuthenticationFragment$key = {
	readonly " $data"?: TwoFactorAuthenticationFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"TwoFactorAuthenticationFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "TwoFactorAuthenticationFragment",
	selections: [
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "has2faEnabled",
			storageKey: null,
		},
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "sudoModeExpiresAt",
			storageKey: null,
		},
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "twoFactorProviders",
			storageKey: null,
		},
	],
	type: "Account",
	abstractKey: null,
};

(node as any).hash = "ca3033caaeab2f441c58b75d1ff285da";

export default node;
