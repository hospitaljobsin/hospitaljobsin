/**
 * @generated SignedSource<<1bb1e02104178c4f5179fb3bfcf88944>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from "relay-runtime";
import type { FragmentRefs } from "relay-runtime";
export type AuthNavigationFragment$data = {
	readonly __typename: "Account";
	readonly avatarUrl: string;
	readonly fullName: string;
	readonly " $fragmentType": "AuthNavigationFragment";
};
export type AuthNavigationFragment$key = {
	readonly " $data"?: AuthNavigationFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"AuthNavigationFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "AuthNavigationFragment",
	selections: [
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "__typename",
			storageKey: null,
		},
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "fullName",
			storageKey: null,
		},
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "avatarUrl",
			storageKey: null,
		},
	],
	type: "Account",
	abstractKey: null,
};

(node as any).hash = "01e123ae0d745f9b0689dabaeab30731";

export default node;
