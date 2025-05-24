/**
 * @generated SignedSource<<8e9c2cc1cd7699ecaa674e929478beb1>>
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
export type UpdatePasswordModalFragment$data = {
	readonly authProviders: ReadonlyArray<AuthProvider>;
	readonly " $fragmentType": "UpdatePasswordModalFragment";
};
export type UpdatePasswordModalFragment$key = {
	readonly " $data"?: UpdatePasswordModalFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"UpdatePasswordModalFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "UpdatePasswordModalFragment",
	selections: [
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "authProviders",
			storageKey: null,
		},
	],
	type: "Account",
	abstractKey: null,
};

(node as any).hash = "3e075d9ebd984d83be2f92b50787e0cc";

export default node;
