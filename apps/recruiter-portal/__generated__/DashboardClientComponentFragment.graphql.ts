import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type DashboardClientComponentFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<"DashboardViewFragment">;
	readonly " $fragmentType": "DashboardClientComponentFragment";
};
export type DashboardClientComponentFragment$key = {
	readonly " $data"?: DashboardClientComponentFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"DashboardClientComponentFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "DashboardClientComponentFragment",
	selections: [
		{
			args: null,
			kind: "FragmentSpread",
			name: "DashboardViewFragment",
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "4f3e4982f78889d6d36f443e3bddc80e";

export default node;
