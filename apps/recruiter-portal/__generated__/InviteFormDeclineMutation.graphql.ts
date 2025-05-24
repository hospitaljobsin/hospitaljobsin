/**
 * @generated SignedSource<<119ebb3bebbd9014aafa39188d601df4>>
 * @relayHash 45301f1eae91843e263067e06f6ca05c
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 45301f1eae91843e263067e06f6ca05c

import type { ConcreteRequest } from "relay-runtime";
export type InviteFormDeclineMutation$variables = {
	inviteToken: string;
};
export type InviteFormDeclineMutation$data = {
	readonly declineOrganizationInvite:
		| {
				readonly __typename: "OrganizationInviteEdge";
				readonly __typename: "OrganizationInviteEdge";
		  }
		| {
				readonly __typename: "OrganizationInviteNotFoundError";
				readonly __typename: "OrganizationInviteNotFoundError";
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
};
export type InviteFormDeclineMutation = {
	response: InviteFormDeclineMutation$data;
	variables: InviteFormDeclineMutation$variables;
};

const node: ConcreteRequest = (() => {
	var v0 = [
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "inviteToken",
			},
		],
		v1 = [
			{
				alias: null,
				args: [
					{
						kind: "Variable",
						name: "inviteToken",
						variableName: "inviteToken",
					},
				],
				concreteType: null,
				kind: "LinkedField",
				name: "declineOrganizationInvite",
				plural: false,
				selections: [
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
		];
	return {
		fragment: {
			argumentDefinitions: v0 /*: any*/,
			kind: "Fragment",
			metadata: null,
			name: "InviteFormDeclineMutation",
			selections: v1 /*: any*/,
			type: "Mutation",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: v0 /*: any*/,
			kind: "Operation",
			name: "InviteFormDeclineMutation",
			selections: v1 /*: any*/,
		},
		params: {
			id: "45301f1eae91843e263067e06f6ca05c",
			metadata: {},
			name: "InviteFormDeclineMutation",
			operationKind: "mutation",
			text: null,
		},
	};
})();

(node as any).hash = "fb61849c3a0e054ace3e11f7280e0c0a";

export default node;
