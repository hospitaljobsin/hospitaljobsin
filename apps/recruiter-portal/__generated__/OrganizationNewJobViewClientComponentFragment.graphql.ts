import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type OrganizationNewJobViewClientComponentFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<"NewJobViewFragment">;
	readonly " $fragmentType": "OrganizationNewJobViewClientComponentFragment";
};
export type OrganizationNewJobViewClientComponentFragment$key = {
	readonly " $data"?: OrganizationNewJobViewClientComponentFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"OrganizationNewJobViewClientComponentFragment">;
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
	name: "OrganizationNewJobViewClientComponentFragment",
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
			name: "NewJobViewFragment",
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "60e1d6da401c30df90a02d477c4275e3";

export default node;
