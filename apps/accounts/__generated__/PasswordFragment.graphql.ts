/**
 * @generated SignedSource<<d48abc82698221d4bcdc7b867a11499d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from "relay-runtime";
export type AuthProvider =
	| "OAUTH_GOOGLE"
	| "PASSWORD"
	| "WEBAUTHN_CREDENTIAL"
	| "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type PasswordFragment$data = {
	readonly authProviders: ReadonlyArray<AuthProvider>;
	readonly sudoModeExpiresAt: any | null | undefined;
	readonly " $fragmentSpreads": FragmentRefs<"UpdatePasswordModalFragment">;
	readonly " $fragmentType": "PasswordFragment";
};
export type PasswordFragment$key = {
	readonly " $data"?: PasswordFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"PasswordFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "PasswordFragment",
	selections: [
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
			name: "authProviders",
			storageKey: null,
		},
		{
			args: null,
			kind: "FragmentSpread",
			name: "UpdatePasswordModalFragment",
		},
	],
	type: "Account",
	abstractKey: null,
};

(node as any).hash = "16341d8dd7398e296702a5779ef832f9";

export default node;
