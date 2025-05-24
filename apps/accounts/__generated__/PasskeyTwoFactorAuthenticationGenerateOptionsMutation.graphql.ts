/**
 * @generated SignedSource<<02aa331a28e42cc1872760405a042e3f>>
 * @relayHash abfbc91d39966d26ab1d7a700ad8afcc
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID abfbc91d39966d26ab1d7a700ad8afcc

import type { ConcreteRequest } from "relay-runtime";
export type PasskeyTwoFactorAuthenticationGenerateOptionsMutation$variables = {
	captchaToken: string;
};
export type PasskeyTwoFactorAuthenticationGenerateOptionsMutation$data = {
	readonly generateAuthenticationOptions:
		| {
				readonly __typename: "GenerateAuthenticationOptionsSuccess";
				readonly authenticationOptions: any;
		  }
		| {
				readonly __typename: "InvalidCaptchaTokenError";
				readonly message: string;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
};
export type PasskeyTwoFactorAuthenticationGenerateOptionsMutation = {
	response: PasskeyTwoFactorAuthenticationGenerateOptionsMutation$data;
	variables: PasskeyTwoFactorAuthenticationGenerateOptionsMutation$variables;
};

const node: ConcreteRequest = (() => {
	var v0 = [
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "captchaToken",
			},
		],
		v1 = [
			{
				alias: null,
				args: [
					{
						kind: "Variable",
						name: "captchaToken",
						variableName: "captchaToken",
					},
				],
				concreteType: null,
				kind: "LinkedField",
				name: "generateAuthenticationOptions",
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
								name: "message",
								storageKey: null,
							},
						],
						type: "InvalidCaptchaTokenError",
						abstractKey: null,
					},
					{
						kind: "InlineFragment",
						selections: [
							{
								alias: null,
								args: null,
								kind: "ScalarField",
								name: "authenticationOptions",
								storageKey: null,
							},
						],
						type: "GenerateAuthenticationOptionsSuccess",
						abstractKey: null,
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
			name: "PasskeyTwoFactorAuthenticationGenerateOptionsMutation",
			selections: v1 /*: any*/,
			type: "Mutation",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: v0 /*: any*/,
			kind: "Operation",
			name: "PasskeyTwoFactorAuthenticationGenerateOptionsMutation",
			selections: v1 /*: any*/,
		},
		params: {
			id: "abfbc91d39966d26ab1d7a700ad8afcc",
			metadata: {},
			name: "PasskeyTwoFactorAuthenticationGenerateOptionsMutation",
			operationKind: "mutation",
			text: null,
		},
	};
})();

(node as any).hash = "439ee9c9c359679af149d1042ec8185c";

export default node;
