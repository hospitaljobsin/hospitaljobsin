/**
 * @generated SignedSource<<351a58e9ca472f1ff72683e78412dbf1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from "relay-runtime";
import type { FragmentRefs } from "relay-runtime";
export type SessionsListInternalFragment$data = {
	readonly id: string;
	readonly sessions: {
		readonly __id: string;
		readonly edges: ReadonlyArray<{
			readonly node: {
				readonly id: string;
				readonly " $fragmentSpreads": FragmentRefs<"SessionFragment">;
			};
		}>;
		readonly pageInfo: {
			readonly hasNextPage: boolean;
		};
	};
	readonly " $fragmentType": "SessionsListInternalFragment";
};
export type SessionsListInternalFragment$key = {
	readonly " $data"?: SessionsListInternalFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"SessionsListInternalFragment">;
};

import SessionsListPaginationQuery_graphql from "./SessionsListPaginationQuery.graphql";

const node: ReaderFragment = (function () {
	var v0 = ["sessions"],
		v1 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "id",
			storageKey: null,
		};
	return {
		argumentDefinitions: [
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
		],
		kind: "Fragment",
		metadata: {
			connection: [
				{
					count: "count",
					cursor: "cursor",
					direction: "forward",
					path: v0 /*: any*/,
				},
			],
			refetch: {
				connection: {
					forward: {
						count: "count",
						cursor: "cursor",
					},
					backward: null,
					path: v0 /*: any*/,
				},
				fragmentPathInResult: ["node"],
				operation: SessionsListPaginationQuery_graphql,
				identifierInfo: {
					identifierField: "id",
					identifierQueryVariableName: "id",
				},
			},
		},
		name: "SessionsListInternalFragment",
		selections: [
			{
				alias: "sessions",
				args: null,
				concreteType: "SessionConnection",
				kind: "LinkedField",
				name: "__SessionsListInternalFragment_sessions_connection",
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
									v1 /*: any*/,
									{
										args: null,
										kind: "FragmentSpread",
										name: "SessionFragment",
									},
									{
										alias: null,
										args: null,
										kind: "ScalarField",
										name: "__typename",
										storageKey: null,
									},
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
			v1 /*: any*/,
		],
		type: "Account",
		abstractKey: null,
	};
})();

(node as any).hash = "f6b479e4f138541cb67fc7feddc03fec";

export default node;
