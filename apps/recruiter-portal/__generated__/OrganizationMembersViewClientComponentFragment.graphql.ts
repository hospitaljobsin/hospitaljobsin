import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type OrganizationMembersViewClientComponentFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<"OrganizationMembersViewFragment">;
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
			name: "searchTerm",
		},
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
					name: "searchTerm",
					variableName: "searchTerm",
				},
				{
					kind: "Variable",
					name: "slug",
					variableName: "slug",
				},
			],
			kind: "FragmentSpread",
			name: "OrganizationMembersViewFragment",
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "ae9d0353a1691261ac61deed2d514465";

export default node;
