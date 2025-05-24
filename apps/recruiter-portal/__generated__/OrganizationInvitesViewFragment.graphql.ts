import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type OrganizationInvitesViewFragment$data = {
	readonly " $fragmentSpreads": FragmentRefs<
		"OrganizationInvitesControllerFragment" | "OrganizationInvitesListFragment"
	>;
	readonly " $fragmentType": "OrganizationInvitesViewFragment";
};
export type OrganizationInvitesViewFragment$key = {
	readonly " $data"?: OrganizationInvitesViewFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"OrganizationInvitesViewFragment">;
};

const node: ReaderFragment = (() => {
	var v0 = {
		kind: "Variable",
		name: "slug",
		variableName: "slug",
	};
	return {
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
		name: "OrganizationInvitesViewFragment",
		selections: [
			{
				args: [
					{
						kind: "Variable",
						name: "searchTerm",
						variableName: "searchTerm",
					},
					v0 /*: any*/,
				],
				kind: "FragmentSpread",
				name: "OrganizationInvitesListFragment",
			},
			{
				args: [v0 /*: any*/],
				kind: "FragmentSpread",
				name: "OrganizationInvitesControllerFragment",
			},
		],
		type: "Query",
		abstractKey: null,
	};
})();

(node as any).hash = "4d3d2d35a3f54f77892c4110a8b7c20b";

export default node;
