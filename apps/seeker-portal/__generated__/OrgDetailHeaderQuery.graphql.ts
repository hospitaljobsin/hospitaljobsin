import type { ConcreteRequest, FragmentRefs } from "relay-runtime";
export type OrgDetailHeaderQuery$variables = {
	slug: string;
};
export type OrgDetailHeaderQuery$data = {
	readonly organization:
		| {
				readonly __typename: "Organization";
				readonly name: string;
				readonly slug: string;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
	readonly viewer:
		| {
				readonly __typename: "Account";
				readonly " $fragmentSpreads": FragmentRefs<"AuthNavigationFragment">;
		  }
		| {
				readonly __typename: "NotAuthenticatedError";
				readonly __typename: "NotAuthenticatedError";
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
};
export type OrgDetailHeaderQuery = {
	response: OrgDetailHeaderQuery$data;
	variables: OrgDetailHeaderQuery$variables;
};

const node: ConcreteRequest = (() => {
	var v0 = [
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "slug",
			},
		],
		v1 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "__typename",
			storageKey: null,
		},
		v2 = [
			{
				kind: "Variable",
				name: "slug",
				variableName: "slug",
			},
		],
		v3 = {
			kind: "InlineFragment",
			selections: [
				{
					alias: null,
					args: null,
					kind: "ScalarField",
					name: "name",
					storageKey: null,
				},
				{
					alias: null,
					args: null,
					kind: "ScalarField",
					name: "slug",
					storageKey: null,
				},
			],
			type: "Organization",
			abstractKey: null,
		},
		v4 = {
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
		};
	return {
		fragment: {
			argumentDefinitions: v0 /*: any*/,
			kind: "Fragment",
			metadata: null,
			name: "OrgDetailHeaderQuery",
			selections: [
				{
					alias: null,
					args: null,
					concreteType: null,
					kind: "LinkedField",
					name: "viewer",
					plural: false,
					selections: [
						v1 /*: any*/,
						{
							kind: "InlineFragment",
							selections: [
								{
									args: null,
									kind: "FragmentSpread",
									name: "AuthNavigationFragment",
								},
							],
							type: "Account",
							abstractKey: null,
						},
					],
					storageKey: null,
				},
				{
					alias: null,
					args: v2 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "organization",
					plural: false,
					selections: [v1 /*: any*/, v3 /*: any*/],
					storageKey: null,
				},
			],
			type: "Query",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: v0 /*: any*/,
			kind: "Operation",
			name: "OrgDetailHeaderQuery",
			selections: [
				{
					alias: null,
					args: null,
					concreteType: null,
					kind: "LinkedField",
					name: "viewer",
					plural: false,
					selections: [
						v1 /*: any*/,
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
									name: "avatarUrl",
									storageKey: null,
								},
							],
							type: "Account",
							abstractKey: null,
						},
						v4 /*: any*/,
					],
					storageKey: null,
				},
				{
					alias: null,
					args: v2 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "organization",
					plural: false,
					selections: [v1 /*: any*/, v3 /*: any*/, v4 /*: any*/],
					storageKey: null,
				},
			],
		},
		params: {
			id: "18e76c3d0846ff86bf94f9e50322cb70",
			metadata: {},
			name: "OrgDetailHeaderQuery",
			operationKind: "query",
			text: null,
		},
	};
})();

(node as any).hash = "df96a4e07381e4ff786b060739e060cf";

export default node;
