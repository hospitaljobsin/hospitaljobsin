/**
 * @generated SignedSource<<fd96254b91be602581cc50195606dff9>>
 * @relayHash da5fe75d2a9c7853042c5da423e64aae
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID da5fe75d2a9c7853042c5da423e64aae

import type { ConcreteRequest } from "relay-runtime";
import type { FragmentRefs } from "relay-runtime";
export type PasskeysListPaginationQuery$variables = {
	count?: number | null | undefined;
	cursor?: string | null | undefined;
	id: string;
};
export type PasskeysListPaginationQuery$data = {
	readonly node:
		| {
				readonly " $fragmentSpreads": FragmentRefs<"PasskeysListInternalFragment">;
		  }
		| null
		| undefined;
};
export type PasskeysListPaginationQuery = {
	response: PasskeysListPaginationQuery$data;
	variables: PasskeysListPaginationQuery$variables;
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
			name: "PasskeysListPaginationQuery",
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
							name: "PasskeysListInternalFragment",
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
			name: "PasskeysListPaginationQuery",
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
									concreteType: "WebAuthnCredentialConnection",
									kind: "LinkedField",
									name: "webAuthnCredentials",
									plural: false,
									selections: [
										{
											alias: null,
											args: null,
											concreteType: "WebAuthnCredentialEdge",
											kind: "LinkedField",
											name: "edges",
											plural: true,
											selections: [
												{
													alias: null,
													args: null,
													concreteType: "WebAuthnCredential",
													kind: "LinkedField",
													name: "node",
													plural: false,
													selections: [
														v3 /*: any*/,
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "nickname",
															storageKey: null,
														},
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "createdAt",
															storageKey: null,
														},
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "lastUsedAt",
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
									key: "PasskeysListInternalFragment_webAuthnCredentials",
									kind: "LinkedHandle",
									name: "webAuthnCredentials",
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
			id: "da5fe75d2a9c7853042c5da423e64aae",
			metadata: {},
			name: "PasskeysListPaginationQuery",
			operationKind: "query",
			text: null,
		},
	};
})();

(node as any).hash = "c776a6a5d6073b35b590aa4f333c8f5d";

export default node;
