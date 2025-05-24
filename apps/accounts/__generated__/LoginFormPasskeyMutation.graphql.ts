/**
 * @generated SignedSource<<4c8da8740aaab06b9d127310740bb612>>
 * @relayHash 4fda42b73a2f469a4541a6fe1f4c2492
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 4fda42b73a2f469a4541a6fe1f4c2492

import type { ConcreteRequest } from "relay-runtime";
export type LoginFormPasskeyMutation$variables = {
	authenticationResponse: any;
	captchaToken: string;
};
export type LoginFormPasskeyMutation$data = {
	readonly loginWithPasskey:
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
export type LoginFormPasskeyMutation = {
	response: LoginFormPasskeyMutation$data;
	variables: LoginFormPasskeyMutation$variables;
};

const node: ConcreteRequest = (() => {
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
			name: "LoginFormPasskeyMutation",
			selections: [
				{
					alias: null,
					args: v1 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "loginWithPasskey",
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
			name: "LoginFormPasskeyMutation",
			selections: [
				{
					alias: null,
					args: v1 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "loginWithPasskey",
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
			id: "4fda42b73a2f469a4541a6fe1f4c2492",
			metadata: {},
			name: "LoginFormPasskeyMutation",
			operationKind: "mutation",
			text: null,
		},
	};
})();

(node as any).hash = "2a8ef8b5d335a6ed092a6e39436f905a";

export default node;
