/**
 * @generated SignedSource<<943cc24b947014fb3ea5ba61282812f5>>
 * @relayHash 35d78980db6d8f29f97ba1e4006677e5
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 35d78980db6d8f29f97ba1e4006677e5

import type { ConcreteRequest } from "relay-runtime";
import type { FragmentRefs } from "relay-runtime";
export type UpdateAccountDetailsFormMutation$variables = {
	fullName: string;
};
export type UpdateAccountDetailsFormMutation$data = {
	readonly updateAccount:
		| {
				readonly __typename: "Account";
				readonly " $fragmentSpreads": FragmentRefs<
					"AccountDetailsFragment" | "UpdateAccountDetailsFormFragment"
				>;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
};
export type UpdateAccountDetailsFormMutation = {
	response: UpdateAccountDetailsFormMutation$data;
	variables: UpdateAccountDetailsFormMutation$variables;
};

const node: ConcreteRequest = (function () {
	var v0 = [
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "fullName",
			},
		],
		v1 = [
			{
				kind: "Variable",
				name: "fullName",
				variableName: "fullName",
			},
		],
		v2 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "__typename",
			storageKey: null,
		};
	return {
		fragment: {
			argumentDefinitions: v0 /*: any*/,
			kind: "Fragment",
			metadata: null,
			name: "UpdateAccountDetailsFormMutation",
			selections: [
				{
					alias: null,
					args: v1 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "updateAccount",
					plural: false,
					selections: [
						v2 /*: any*/,
						{
							kind: "InlineFragment",
							selections: [
								{
									args: null,
									kind: "FragmentSpread",
									name: "UpdateAccountDetailsFormFragment",
								},
								{
									args: null,
									kind: "FragmentSpread",
									name: "AccountDetailsFragment",
								},
							],
							type: "Account",
							abstractKey: null,
						},
					],
					storageKey: null,
				},
			],
			type: "Mutation",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: v0 /*: any*/,
			kind: "Operation",
			name: "UpdateAccountDetailsFormMutation",
			selections: [
				{
					alias: null,
					args: v1 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "updateAccount",
					plural: false,
					selections: [
						v2 /*: any*/,
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
			id: "35d78980db6d8f29f97ba1e4006677e5",
			metadata: {},
			name: "UpdateAccountDetailsFormMutation",
			operationKind: "mutation",
			text: null,
		},
	};
})();

(node as any).hash = "4b824b87f596744724d561b3e247111d";

export default node;
