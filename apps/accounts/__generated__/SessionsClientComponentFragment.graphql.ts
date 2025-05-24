/**
 * @generated SignedSource<<38e41bfe2feb3713d710845d53c071ab>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from "relay-runtime";
import type { FragmentRefs } from "relay-runtime";
export type SessionsClientComponentFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<"SessionsSettingsViewFragment">;
	readonly " $fragmentType": "SessionsClientComponentFragment";
};
export type SessionsClientComponentFragment$key = {
	readonly " $data"?: SessionsClientComponentFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"SessionsClientComponentFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "SessionsClientComponentFragment",
	selections: [
		{
			args: null,
			kind: "FragmentSpread",
			name: "SessionsSettingsViewFragment",
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "f3ea9a0cb2ec87a762364d7f6a901df6";

export default node;
