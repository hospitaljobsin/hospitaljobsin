import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type OrganizationMembersViewClientComponentFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<"OrganizationMembersTabFragment">;
	readonly " $fragmentType": "OrganizationMembersViewClientComponentFragment";
};
export type OrganizationMembersViewClientComponentFragment$key = {
	readonly " $data"?: OrganizationMembersViewClientComponentFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"OrganizationMembersViewClientComponentFragment">;
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
	name: "OrganizationMembersViewClientComponentFragment",
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
			name: "OrganizationMembersTabFragment",
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "95ce6583e178a578e848104566131c95";

export default node;
