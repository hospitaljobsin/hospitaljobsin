import type { ConcreteRequest, FragmentRefs } from "relay-runtime";
export type pageAccountSettingsQuery$variables = Record<PropertyKey, never>;
export type pageAccountSettingsQuery$data = {
	readonly " $fragmentSpreads": FragmentRefs<"AccountClientComponentFragment">;
};
export type pageAccountSettingsQuery = {
	response: pageAccountSettingsQuery$data;
	variables: pageAccountSettingsQuery$variables;
};

const node: ConcreteRequest = {
	fragment: {
		argumentDefinitions: [],
		kind: "Fragment",
		metadata: null,
		name: "pageAccountSettingsQuery",
		selections: [
			{
				args: null,
				kind: "FragmentSpread",
				name: "AccountClientComponentFragment",
			},
		],
		type: "Query",
		abstractKey: null,
	},
	kind: "Request",
	operation: {
		argumentDefinitions: [],
		kind: "Operation",
		name: "pageAccountSettingsQuery",
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
								alias: null,
								args: null,
								kind: "ScalarField",
								name: "fullName",
								storageKey: null,
							},
							{
								alias: null,
								args: null,
								kind: "ScalarField",
								name: "email",
								storageKey: null,
							},
							{
								alias: null,
								args: [
									{
										kind: "Literal",
										name: "size",
										value: 120,
									},
								],
								kind: "ScalarField",
								name: "avatarUrl",
								storageKey: "avatarUrl(size:120)",
							},
							{
								alias: null,
								args: null,
								kind: "ScalarField",
								name: "has2faEnabled",
								storageKey: null,
							},
							{
								alias: null,
								args: null,
								kind: "ScalarField",
								name: "sudoModeExpiresAt",
								storageKey: null,
							},
							{
								alias: null,
								args: null,
								kind: "ScalarField",
								name: "twoFactorProviders",
								storageKey: null,
							},
							{
								alias: null,
								args: null,
								kind: "ScalarField",
								name: "authProviders",
								storageKey: null,
							},
						],
						type: "Account",
						abstractKey: null,
					},
					{
						kind: "InlineFragment",
						selections: [
							{
								alias: null,
								args: null,
								kind: "ScalarField",
								name: "id",
								storageKey: null,
							},
						],
						type: "Node",
						abstractKey: "__isNode",
					},
				],
				storageKey: null,
			},
		],
	},
	params: {
		id: "fbaf15a2e39707fd3d0a4dcf8d668beb",
		metadata: {},
		name: "pageAccountSettingsQuery",
		operationKind: "query",
		text: null,
	},
};

(node as any).hash = "c72ca15e1c492e386bed888a7aadcbb2";

export default node;
