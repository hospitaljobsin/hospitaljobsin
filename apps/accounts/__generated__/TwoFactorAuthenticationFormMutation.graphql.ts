/**
 * @generated SignedSource<<21d79b9d0b3a9318dc7314ad897a625a>>
 * @relayHash a8323e313adde4cefabc3bc55bc0eeaa
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID a8323e313adde4cefabc3bc55bc0eeaa

import type { ConcreteRequest } from "relay-runtime";
export type TwoFactorAuthenticationFormMutation$variables = {
	captchaToken: string;
	token: string;
};
export type TwoFactorAuthenticationFormMutation$data = {
	readonly verify2faWithAuthenticator:
		| {
				readonly __typename: "Account";
				readonly __typename: "Account";
		  }
		| {
				readonly __typename: "AuthenticatorNotEnabledError";
				readonly message: string;
		  }
		| {
				readonly __typename: "InvalidCaptchaTokenError";
				readonly message: string;
		  }
		| {
				readonly __typename: "InvalidCredentialsError";
				readonly message: string;
		  }
		| {
				readonly __typename: "TwoFactorAuthenticationChallengeNotFoundError";
				readonly message: string;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
};
export type TwoFactorAuthenticationFormMutation = {
	response: TwoFactorAuthenticationFormMutation$data;
	variables: TwoFactorAuthenticationFormMutation$variables;
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
			name: "token",
		},
		v2 = [
			{
				kind: "Variable",
				name: "captchaToken",
				variableName: "captchaToken",
			},
			{
				kind: "Variable",
				name: "token",
				variableName: "token",
			},
		],
		v3 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "__typename",
			storageKey: null,
		},
		v4 = [
			{
				alias: null,
				args: null,
				kind: "ScalarField",
				name: "message",
				storageKey: null,
			},
		],
		v5 = {
			kind: "InlineFragment",
			selections: v4 /*: any*/,
			type: "TwoFactorAuthenticationChallengeNotFoundError",
			abstractKey: null,
		},
		v6 = {
			kind: "InlineFragment",
			selections: v4 /*: any*/,
			type: "InvalidCaptchaTokenError",
			abstractKey: null,
		},
		v7 = {
			kind: "InlineFragment",
			selections: v4 /*: any*/,
			type: "AuthenticatorNotEnabledError",
			abstractKey: null,
		},
		v8 = {
			kind: "InlineFragment",
			selections: v4 /*: any*/,
			type: "InvalidCredentialsError",
			abstractKey: null,
		};
	return {
		fragment: {
			argumentDefinitions: [v0 /*: any*/, v1 /*: any*/],
			kind: "Fragment",
			metadata: null,
			name: "TwoFactorAuthenticationFormMutation",
			selections: [
				{
					alias: null,
					args: v2 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "verify2faWithAuthenticator",
					plural: false,
					selections: [
						v3 /*: any*/,
						v5 /*: any*/,
						v6 /*: any*/,
						v7 /*: any*/,
						v8 /*: any*/,
					],
					storageKey: null,
				},
			],
			type: "Mutation",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: [v1 /*: any*/, v0 /*: any*/],
			kind: "Operation",
			name: "TwoFactorAuthenticationFormMutation",
			selections: [
				{
					alias: null,
					args: v2 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "verify2faWithAuthenticator",
					plural: false,
					selections: [
						v3 /*: any*/,
						v5 /*: any*/,
						v6 /*: any*/,
						v7 /*: any*/,
						v8 /*: any*/,
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
			id: "a8323e313adde4cefabc3bc55bc0eeaa",
			metadata: {},
			name: "TwoFactorAuthenticationFormMutation",
			operationKind: "mutation",
			text: null,
		},
	};
})();

(node as any).hash = "b26efffba9bd42cd6a777eba6f7efbc0";

export default node;
