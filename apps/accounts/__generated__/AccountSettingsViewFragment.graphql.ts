import type { FragmentRefs, ReaderFragment } from "relay-runtime";
export type AccountSettingsViewFragment$data = {
	readonly viewer:
		| {
				readonly __typename: "Account";
				readonly " $fragmentSpreads": FragmentRefs<
					| "AccountDetailsFragment"
					| "PasswordFragment"
					| "TwoFactorAuthenticationFragment"
					| "UpdateAccountDetailsFormFragment"
				>;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
	readonly " $fragmentType": "AccountSettingsViewFragment";
};
export type AccountSettingsViewFragment$key = {
	readonly " $data"?: AccountSettingsViewFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"AccountSettingsViewFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "AccountSettingsViewFragment",
	selections: [
		{
			alias: null,
			args: null,
			concreteType: null,
			kind: "LinkedField",
			name: "viewer",
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
							name: "AccountDetailsFragment",
						},
						{
							args: null,
							kind: "FragmentSpread",
							name: "UpdateAccountDetailsFormFragment",
						},
						{
							args: null,
							kind: "FragmentSpread",
							name: "TwoFactorAuthenticationFragment",
						},
						{
							args: null,
							kind: "FragmentSpread",
							name: "PasswordFragment",
						},
					],
					type: "Account",
					abstractKey: null,
				},
			],
			storageKey: null,
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "c1ca01a5e7286de4297ca807a7611a45";

export default node;
