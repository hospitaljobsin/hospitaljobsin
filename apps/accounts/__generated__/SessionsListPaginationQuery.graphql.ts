/**
 * @generated SignedSource<<2c807eb007e90d54c6f38fe23153ff22>>
 * @relayHash 078d0b2eca291f326b10980daa502944
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 078d0b2eca291f326b10980daa502944

import type { ConcreteRequest } from "relay-runtime";
import type { FragmentRefs } from "relay-runtime";
export type SessionsListPaginationQuery$variables = {
	count?: number | null | undefined;
	cursor?: string | null | undefined;
	id: string;
};
export type SessionsListPaginationQuery$data = {
	readonly node:
		| {
				readonly " $fragmentSpreads": FragmentRefs<"SessionsListInternalFragment">;
		  }
		| null
		| undefined;
};
export type SessionsListPaginationQuery = {
	response: SessionsListPaginationQuery$data;
	variables: SessionsListPaginationQuery$variables;
};

const node: ConcreteRequest = (function () {
	var v0 = [
			{
				defaultValue: 10,
				kind: "LocalArgument",
				name: "count",
			},
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "cursor",
			},
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "id",
			},
		],
		v1 = [
			{
				kind: "Variable",
				name: "id",
				variableName: "id",
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
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "id",
			storageKey: null,
		},
		v4 = [
			{
				kind: "Variable",
				name: "after",
				variableName: "cursor",
			},
			{
				kind: "Variable",
				name: "first",
				variableName: "count",
			},
		];
	return {
		fragment: {
			argumentDefinitions: v0 /*: any*/,
			kind: "Fragment",
			metadata: null,
			name: "SessionsListPaginationQuery",
			selections: [
				{
					alias: null,
					args: v1 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "node",
					plural: false,
					selections: [
						{
							args: [
								{
									kind: "Variable",
									name: "count",
									variableName: "count",
								},
								{
									kind: "Variable",
									name: "cursor",
									variableName: "cursor",
								},
							],
							kind: "FragmentSpread",
							name: "SessionsListInternalFragment",
						},
					],
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
			name: "SessionsListPaginationQuery",
			selections: [
				{
					alias: null,
					args: v1 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "node",
					plural: false,
					selections: [
						v2 /*: any*/,
						v3 /*: any*/,
						{
							kind: "InlineFragment",
							selections: [
								{
									alias: null,
									args: v4 /*: any*/,
									concreteType: "SessionConnection",
									kind: "LinkedField",
									name: "sessions",
									plural: false,
									selections: [
										{
											alias: null,
											args: null,
											concreteType: "SessionEdge",
											kind: "LinkedField",
											name: "edges",
											plural: true,
											selections: [
												{
													alias: null,
													args: null,
													concreteType: "Session",
													kind: "LinkedField",
													name: "node",
													plural: false,
													selections: [
														v3 /*: any*/,
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "userAgent",
															storageKey: null,
														},
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "ipAddress",
															storageKey: null,
														},
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "createdAt",
															storageKey: null,
														},
														v2 /*: any*/,
													],
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "cursor",
													storageKey: null,
												},
											],
											storageKey: null,
										},
										{
											alias: null,
											args: null,
											concreteType: "PageInfo",
											kind: "LinkedField",
											name: "pageInfo",
											plural: false,
											selections: [
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "hasNextPage",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "endCursor",
													storageKey: null,
												},
											],
											storageKey: null,
										},
										{
											kind: "ClientExtension",
											selections: [
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "__id",
													storageKey: null,
												},
											],
										},
									],
									storageKey: null,
								},
								{
									alias: null,
									args: v4 /*: any*/,
									filters: null,
									handle: "connection",
									key: "SessionsListInternalFragment_sessions",
									kind: "LinkedHandle",
									name: "sessions",
								},
							],
							type: "Account",
							abstractKey: null,
						},
					],
					storageKey: null,
				},
			],
		},
		params: {
			id: "078d0b2eca291f326b10980daa502944",
			metadata: {},
			name: "SessionsListPaginationQuery",
			operationKind: "query",
			text: null,
		},
	};
})();

(node as any).hash = "f6b479e4f138541cb67fc7feddc03fec";

export default node;
