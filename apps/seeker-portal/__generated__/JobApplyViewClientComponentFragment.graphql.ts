import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type JobApplyViewClientComponentFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<"JobApplyViewFragment">;
	readonly " $fragmentType": "JobApplyViewClientComponentFragment";
};
export type JobApplyViewClientComponentFragment$key = {
	readonly " $data"?: JobApplyViewClientComponentFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"JobApplyViewClientComponentFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [
		{
			defaultValue: null,
			kind: "LocalArgument",
			name: "jobSlug",
		},
		{
			defaultValue: null,
			kind: "LocalArgument",
			name: "slug",
		},
	],
	kind: "Fragment",
	metadata: null,
	name: "JobApplyViewClientComponentFragment",
	selections: [
		{
			args: [
				{
					kind: "Variable",
					name: "jobSlug",
					variableName: "jobSlug",
				},
				{
					kind: "Variable",
					name: "slug",
					variableName: "slug",
				},
			],
			kind: "FragmentSpread",
			name: "JobApplyViewFragment",
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "265ee8cb7ff5df311fc26117e5e2f1a6";

export default node;
