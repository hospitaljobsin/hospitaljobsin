/**
 * @generated SignedSource<<e1e997810bf01229ad9af880e8e864ae>>
 * @relayHash 4f7d0cab5e1523e7992fd5583666784e
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 4f7d0cab5e1523e7992fd5583666784e

import type { ConcreteRequest } from "relay-runtime";
export type PasskeyRegistrationOptionsMutation$variables = {
	captchaToken: string;
	email: string;
	fullName: string;
};
export type PasskeyRegistrationOptionsMutation$data = {
	readonly generatePasskeyRegistrationOptions:
		| {
				readonly __typename: "EmailInUseError";
				readonly message: string;
		  }
		| {
				readonly __typename: "GeneratePasskeyRegistrationOptionsSuccess";
				readonly registrationOptions: any;
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
export type PasskeyRegistrationOptionsMutation = {
	response: PasskeyRegistrationOptionsMutation$data;
	variables: PasskeyRegistrationOptionsMutation$variables;
};

const node: ConcreteRequest = (function () {
	var v0 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "captchaToken",
		},
		v1 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "email",
		},
		v2 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "fullName",
		},
		v3 = [
			{
				alias: null,
				args: null,
				kind: "ScalarField",
				name: "message",
				storageKey: null,
			},
		],
		v4 = [
			{
				alias: null,
				args: [
					{
						kind: "Variable",
						name: "captchaToken",
						variableName: "captchaToken",
					},
					{
						kind: "Variable",
						name: "email",
						variableName: "email",
					},
					{
						kind: "Variable",
						name: "fullName",
						variableName: "fullName",
					},
				],
				concreteType: null,
				kind: "LinkedField",
				name: "generatePasskeyRegistrationOptions",
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
						selections: v3 /*: any*/,
						type: "EmailInUseError",
						abstractKey: null,
					},
					{
						kind: "InlineFragment",
						selections: v3 /*: any*/,
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
								name: "registrationOptions",
								storageKey: null,
							},
						],
						type: "GeneratePasskeyRegistrationOptionsSuccess",
						abstractKey: null,
					},
				],
				storageKey: null,
			},
		];
	return {
		fragment: {
			argumentDefinitions: [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/],
			kind: "Fragment",
			metadata: null,
			name: "PasskeyRegistrationOptionsMutation",
			selections: v4 /*: any*/,
			type: "Mutation",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: [v1 /*: any*/, v2 /*: any*/, v0 /*: any*/],
			kind: "Operation",
			name: "PasskeyRegistrationOptionsMutation",
			selections: v4 /*: any*/,
		},
		params: {
			id: "4f7d0cab5e1523e7992fd5583666784e",
			metadata: {},
			name: "PasskeyRegistrationOptionsMutation",
			operationKind: "mutation",
			text: null,
		},
	};
})();

(node as any).hash = "0992787673b5f876e749f66a46fbbdd7";

export default node;
