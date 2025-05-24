import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type OrganizationOverviewTabFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<"OrganizationDetailsFragment">;
	readonly " $fragmentType": "OrganizationOverviewTabFragment";
};
export type OrganizationOverviewTabFragment$key = {
	readonly " $data"?: OrganizationOverviewTabFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"OrganizationOverviewTabFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [
		{
			defaultValue: null,
			kind: "LocalArgument",
			name: "slug",
		},
	],
	kind: "Fragment",
	metadata: null,
	name: "OrganizationOverviewTabFragment",
	selections: [
		{
			args: [
				{
					kind: "Variable",
					name: "slug",
					variableName: "slug",
				},
			],
			kind: "FragmentSpread",
			name: "OrganizationDetailsFragment",
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "a1667487376aa4bc2db5264ddb5b049c";

export default node;
