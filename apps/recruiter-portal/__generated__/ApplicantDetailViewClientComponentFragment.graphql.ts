import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type ApplicantDetailViewClientComponentFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<"ApplicantDetailViewFragment">;
	readonly " $fragmentType": "ApplicantDetailViewClientComponentFragment";
};
export type ApplicantDetailViewClientComponentFragment$key = {
	readonly " $data"?: ApplicantDetailViewClientComponentFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"ApplicantDetailViewClientComponentFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [
		{
			defaultValue: null,
			kind: "LocalArgument",
			name: "applicantSlug",
		},
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
	name: "ApplicantDetailViewClientComponentFragment",
	selections: [
		{
			args: [
				{
					kind: "Variable",
					name: "applicantSlug",
					variableName: "applicantSlug",
				},
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
			name: "ApplicantDetailViewFragment",
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "ffa20f7f16ffcb93e439276fc8733abd";

export default node;
