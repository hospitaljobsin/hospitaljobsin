/**
 * @generated SignedSource<<a20860803995083913959ef441d88127>>
 * @relayHash 78372d3f2e87a9fdb92ca4ef551b1d05
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 78372d3f2e87a9fdb92ca4ef551b1d05

import type { ConcreteRequest } from "relay-runtime";
export type SidebarMembersQuery$variables = {
	slug: string;
};
export type SidebarMembersQuery$data = {
	readonly organization:
		| {
				readonly __typename: "Organization";
				readonly isAdmin: boolean;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
};
export type SidebarMembersQuery = {
	response: SidebarMembersQuery$data;
	variables: SidebarMembersQuery$variables;
};

const node: ConcreteRequest = (() => {
	var v0 = [
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "slug",
			},
		],
		v1 = [
			{
				kind: "Variable",
				name: "slug",
				variableName: "slug",
			},
		],
		v2 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "__typename",
			storageKey: null,
		},
		v3 = {
			kind: "InlineFragment",
			selections: [
				{
					alias: null,
					args: null,
					kind: "ScalarField",
					name: "isAdmin",
					storageKey: null,
				},
			],
			type: "Organization",
			abstractKey: null,
		};
	return {
		fragment: {
			argumentDefinitions: v0 /*: any*/,
			kind: "Fragment",
			metadata: null,
			name: "SidebarMembersQuery",
			selections: [
				{
					alias: null,
					args: v1 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "organization",
					plural: false,
					selections: [v2 /*: any*/, v3 /*: any*/],
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
			name: "SidebarMembersQuery",
			selections: [
				{
					alias: null,
					args: v1 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "organization",
					plural: false,
					selections: [
						v2 /*: any*/,
						v3 /*: any*/,
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
			id: "78372d3f2e87a9fdb92ca4ef551b1d05",
			metadata: {},
			name: "SidebarMembersQuery",
			operationKind: "query",
			text: null,
		},
	};
})();

(node as any).hash = "6a3497d4c5ec44d8546ffe97ca5ea697";

export default node;
