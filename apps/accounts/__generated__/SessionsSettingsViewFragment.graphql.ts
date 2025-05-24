/**
 * @generated SignedSource<<92c4ecef15a82ec7ef1bb1b646eb017d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from "relay-runtime";
import type { FragmentRefs } from "relay-runtime";
export type SessionsSettingsViewFragment$data = {
	readonly viewer:
		| {
				readonly __typename: "Account";
				readonly " $fragmentSpreads": FragmentRefs<"SessionsListFragment">;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
	readonly " $fragmentType": "SessionsSettingsViewFragment";
};
export type SessionsSettingsViewFragment$key = {
	readonly " $data"?: SessionsSettingsViewFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"SessionsSettingsViewFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "SessionsSettingsViewFragment",
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
							name: "SessionsListFragment",
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

(node as any).hash = "8091ad2e73d19c74aac7659ac4c74aed";

export default node;
