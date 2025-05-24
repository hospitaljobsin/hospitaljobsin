import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type OrganizationInvitesControllerFragment$data = {
	readonly organization:
		| {
				readonly __typename: "Organization";
				readonly " $fragmentSpreads": FragmentRefs<"InviteMemberModalFragment">;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
	readonly " $fragmentType": "OrganizationInvitesControllerFragment";
};
export type OrganizationInvitesControllerFragment$key = {
	readonly " $data"?: OrganizationInvitesControllerFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"OrganizationInvitesControllerFragment">;
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
	name: "OrganizationInvitesControllerFragment",
	selections: [
		{
			alias: null,
			args: [
				{
					kind: "Variable",
					name: "slug",
					variableName: "slug",
				},
			],
			concreteType: null,
			kind: "LinkedField",
			name: "organization",
			plural: false,
			selections: [
				{
					alias: null,
					args: null,
					kind: "ScalarField",
					name: "__typename",
					storageKey: null,
				},
				{
					kind: "InlineFragment",
					selections: [
						{
							args: null,
							kind: "FragmentSpread",
							name: "InviteMemberModalFragment",
						},
					],
					type: "Organization",
					abstractKey: null,
				},
			],
			storageKey: null,
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "a5963963273bff7799766ac5fbecd31d";

export default node;
