import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type JobDetailViewClientComponentFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<"JobDetailViewFragment">;
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
			name: "JobDetailViewFragment",
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "807520c173fe2da85979149a505ab030";

export default node;
