import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type OrganizationDetailsFragment$data = {
	readonly organization:
		| {
				readonly __typename: "Organization";
				readonly " $fragmentSpreads": FragmentRefs<"OrganizationDetailsInternalFragment">;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
	readonly " $fragmentType": "OrganizationDetailsFragment";
};
export type OrganizationDetailsFragment$key = {
	readonly " $data"?: OrganizationDetailsFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"OrganizationDetailsFragment">;
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
	name: "OrganizationDetailsFragment",
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
							name: "OrganizationDetailsInternalFragment",
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

(node as any).hash = "070b1032f57c01192d6ca7e62fbd3f40";

export default node;
