/**
 * @generated SignedSource<<e58fe20f37137ff5aea806527a0606bb>>
 * @relayHash f67d7015c3f0fc1b207ab8b1303459be
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID f67d7015c3f0fc1b207ab8b1303459be

import type { ConcreteRequest } from "relay-runtime";
export type PasskeysControllerGenerateOptionsMutation$variables = Record<
	PropertyKey,
	never
>;
export type PasskeysControllerGenerateOptionsMutation$data = {
	readonly generateWebAuthnCredentialCreationOptions: {
		readonly registrationOptions?: any;
	};
};
export type PasskeysControllerGenerateOptionsMutation = {
	response: PasskeysControllerGenerateOptionsMutation$data;
	variables: PasskeysControllerGenerateOptionsMutation$variables;
};

const node: ConcreteRequest = (() => {
	var v0 = {
		kind: "InlineFragment",
		selections: [
			{
				alias: null,
				args: null,
				kind: "ScalarField",
				name: "registrationOptions",
				storageKey: null,
			},
		],
		type: "GeneratePasskeyCreationOptionsSuccess",
		abstractKey: null,
	};
	return {
		fragment: {
			argumentDefinitions: [],
			kind: "Fragment",
			metadata: null,
			name: "PasskeysControllerGenerateOptionsMutation",
			selections: [
				{
					alias: null,
					args: null,
					concreteType: null,
					kind: "LinkedField",
					name: "generateWebAuthnCredentialCreationOptions",
					plural: false,
					selections: [v0 /*: any*/],
					storageKey: null,
				},
			],
			type: "Mutation",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: [],
			kind: "Operation",
			name: "PasskeysControllerGenerateOptionsMutation",
			selections: [
				{
					alias: null,
					args: null,
					concreteType: null,
					kind: "LinkedField",
					name: "generateWebAuthnCredentialCreationOptions",
					plural: false,
					selections: [
						{
							alias: null,
							args: null,
							kind: "ScalarField",
							name: "__typename",
							storageKey: null,
						},
						v0 /*: any*/,
					],
					storageKey: null,
				},
			],
		},
		params: {
			id: "f67d7015c3f0fc1b207ab8b1303459be",
			metadata: {},
			name: "PasskeysControllerGenerateOptionsMutation",
			operationKind: "mutation",
			text: null,
		},
	};
})();

(node as any).hash = "fdbb2a7254cca153785882e5ba4b9ac1";

export default node;
