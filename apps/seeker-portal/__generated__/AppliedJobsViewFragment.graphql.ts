import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type AppliedJobsViewFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<"AppliedJobsListFragment">;
	readonly " $fragmentType": "AppliedJobsViewFragment";
};
export type AppliedJobsViewFragment$key = {
	readonly " $data"?: AppliedJobsViewFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"AppliedJobsViewFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "AppliedJobsViewFragment",
	selections: [
		{
			args: null,
			kind: "FragmentSpread",
			name: "AppliedJobsListFragment",
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "9cd0918b218dc030372e59084379616a";

export default node;
