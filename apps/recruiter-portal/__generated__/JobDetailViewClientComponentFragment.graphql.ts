import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type JobDetailViewClientComponentFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<"JobOverviewTabFragment">;
	readonly " $fragmentType": "JobDetailViewClientComponentFragment";
};
export type JobDetailViewClientComponentFragment$key = {
	readonly " $data"?: JobDetailViewClientComponentFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"JobDetailViewClientComponentFragment">;
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
	name: "JobDetailViewClientComponentFragment",
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
			name: "JobOverviewTabFragment",
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "902a755ecc4b600acecddc0a42b48d49";

export default node;
