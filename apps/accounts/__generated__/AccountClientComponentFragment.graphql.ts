import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type AccountClientComponentFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<"AccountSettingsViewFragment">;
	readonly " $fragmentType": "AccountClientComponentFragment";
};
export type AccountClientComponentFragment$key = {
	readonly " $data"?: AccountClientComponentFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"AccountClientComponentFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "AccountClientComponentFragment",
	selections: [
		{
			args: null,
			kind: "FragmentSpread",
			name: "AccountSettingsViewFragment",
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "740d0c484c7ffa9fd0c4a6e75332faec";

export default node;
