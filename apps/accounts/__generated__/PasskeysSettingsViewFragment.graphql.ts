/**
 * @generated SignedSource<<35ca311774ef2f24f90374e83b5905a6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from "relay-runtime";
import type { FragmentRefs } from "relay-runtime";
export type PasskeysSettingsViewFragment$data = {
	readonly viewer:
		| {
				readonly __typename: "Account";
				readonly " $fragmentSpreads": FragmentRefs<"PasskeysListFragment">;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
	readonly " $fragmentType": "PasskeysSettingsViewFragment";
};
export type PasskeysSettingsViewFragment$key = {
	readonly " $data"?: PasskeysSettingsViewFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"PasskeysSettingsViewFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "PasskeysSettingsViewFragment",
	selections: [
		{
			alias: null,
			args: null,
			concreteType: null,
			kind: "LinkedField",
			name: "viewer",
			plural: false,
			selections: [
				{
					alias: null,
					args: null,
					kind: "ScalarField",
					name: "__typename",
					storageKey: null,
				},
				{
					kind: "InlineFragment",
					selections: [
						{
							args: null,
							kind: "FragmentSpread",
							name: "PasskeysListFragment",
						},
					],
					type: "Account",
					abstractKey: null,
				},
			],
			storageKey: null,
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "af489af5e2c6a0ee56031027273e602d";

export default node;
