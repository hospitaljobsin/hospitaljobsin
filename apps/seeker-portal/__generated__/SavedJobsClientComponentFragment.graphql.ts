import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type SavedJobsClientComponentFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<"SavedJobsViewFragment">;
	readonly " $fragmentType": "SavedJobsClientComponentFragment";
};
export type SavedJobsClientComponentFragment$key = {
	readonly " $data"?: SavedJobsClientComponentFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"SavedJobsClientComponentFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "SavedJobsClientComponentFragment",
	selections: [
		{
			args: null,
			kind: "FragmentSpread",
			name: "SavedJobsViewFragment",
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "3458f9896c47c6e472e575db3fffdd00";

export default node;
