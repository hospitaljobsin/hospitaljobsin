/**
 * @generated SignedSource<<5e20ea141674b4e3a349130b72f60314>>
 * @relayHash fb5976d66a64a608c65cfcbe6ff6743e
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID fb5976d66a64a608c65cfcbe6ff6743e

import type { ConcreteRequest } from "relay-runtime";
export type PasskeyAuthenticationMutation$variables = {
	authenticationResponse: any;
	captchaToken: string;
};
export type PasskeyAuthenticationMutation$data = {
	readonly requestSudoModeWithPasskey:
		| {
				readonly __typename: "Account";
				readonly __typename: "Account";
		  }
		| {
				readonly __typename: "InvalidCaptchaTokenError";
				readonly message: string;
		  }
		| {
				readonly __typename: "InvalidPasskeyAuthenticationCredentialError";
				readonly message: string;
		  }
		| {
				readonly __typename: "WebAuthnChallengeNotFoundError";
				readonly message: string;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
};
export type PasskeyAuthenticationMutation = {
	response: PasskeyAuthenticationMutation$data;
	variables: PasskeyAuthenticationMutation$variables;
};

const node: ConcreteRequest = (function () {
	var v0 = [
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "authenticationResponse",
			},
			{
				defaultValue: null,
				kind: "LocalArgument",
				name: "captchaToken",
			},
		],
		v1 = [
			{
				kind: "Variable",
				name: "authenticationResponse",
				variableName: "authenticationResponse",
			},
			{
				kind: "Variable",
				name: "captchaToken",
				variableName: "captchaToken",
			},
		],
		v2 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "__typename",
			storageKey: null,
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
		v4 = {
			kind: "InlineFragment",
			selections: v3 /*: any*/,
			type: "InvalidPasskeyAuthenticationCredentialError",
			abstractKey: null,
		},
		v5 = {
			kind: "InlineFragment",
			selections: v3 /*: any*/,
			type: "InvalidCaptchaTokenError",
			abstractKey: null,
		},
		v6 = {
			kind: "InlineFragment",
			selections: v3 /*: any*/,
			type: "WebAuthnChallengeNotFoundError",
			abstractKey: null,
		};
	return {
		fragment: {
			argumentDefinitions: v0 /*: any*/,
			kind: "Fragment",
			metadata: null,
			name: "PasskeyAuthenticationMutation",
			selections: [
				{
					alias: null,
					args: v1 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "requestSudoModeWithPasskey",
					plural: false,
					selections: [v2 /*: any*/, v4 /*: any*/, v5 /*: any*/, v6 /*: any*/],
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
			name: "PasskeyAuthenticationMutation",
			selections: [
				{
					alias: null,
					args: v1 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "requestSudoModeWithPasskey",
					plural: false,
					selections: [
						v2 /*: any*/,
						v4 /*: any*/,
						v5 /*: any*/,
						v6 /*: any*/,
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
			id: "fb5976d66a64a608c65cfcbe6ff6743e",
			metadata: {},
			name: "PasskeyAuthenticationMutation",
			operationKind: "mutation",
			text: null,
		},
	};
})();

(node as any).hash = "feaddad2388e73993da9e7999e492269";

export default node;
