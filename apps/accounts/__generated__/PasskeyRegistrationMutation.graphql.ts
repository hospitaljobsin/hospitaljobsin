/**
 * @generated SignedSource<<91abfd6a18146deb7d6b9cde01f09bef>>
 * @relayHash 63ace3e72963ccdfa082a6a24c5cec59
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 63ace3e72963ccdfa082a6a24c5cec59

import type { ConcreteRequest } from "relay-runtime";
export type PasskeyRegistrationMutation$variables = {
	captchaToken: string;
	email: string;
	emailVerificationToken: string;
	fullName: string;
	passkeyNickname: string;
	passkeyRegistrationResponse: any;
};
export type PasskeyRegistrationMutation$data = {
	readonly registerWithPasskey:
		| {
				readonly __typename: "EmailInUseError";
				readonly message: string;
		  }
		| {
				readonly __typename: "InvalidCaptchaTokenError";
				readonly message: string;
		  }
		| {
				readonly __typename: "InvalidEmailVerificationTokenError";
				readonly message: string;
		  }
		| {
				readonly __typename: "InvalidPasskeyRegistrationCredentialError";
				readonly message: string;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
};
export type PasskeyRegistrationMutation = {
	response: PasskeyRegistrationMutation$data;
	variables: PasskeyRegistrationMutation$variables;
};

const node: ConcreteRequest = (() => {
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
			name: "emailVerificationToken",
		},
		v3 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "fullName",
		},
		v4 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "passkeyNickname",
		},
		v5 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "passkeyRegistrationResponse",
		},
		v6 = [
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
				name: "emailVerificationToken",
				variableName: "emailVerificationToken",
			},
			{
				kind: "Variable",
				name: "fullName",
				variableName: "fullName",
			},
			{
				kind: "Variable",
				name: "passkeyNickname",
				variableName: "passkeyNickname",
			},
			{
				kind: "Variable",
				name: "passkeyRegistrationResponse",
				variableName: "passkeyRegistrationResponse",
			},
		],
		v7 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "__typename",
			storageKey: null,
		},
		v8 = [
			{
				alias: null,
				args: null,
				kind: "ScalarField",
				name: "message",
				storageKey: null,
			},
		],
		v9 = {
			kind: "InlineFragment",
			selections: v8 /*: any*/,
			type: "EmailInUseError",
			abstractKey: null,
		},
		v10 = {
			kind: "InlineFragment",
			selections: v8 /*: any*/,
			type: "InvalidEmailVerificationTokenError",
			abstractKey: null,
		},
		v11 = {
			kind: "InlineFragment",
			selections: v8 /*: any*/,
			type: "InvalidCaptchaTokenError",
			abstractKey: null,
		},
		v12 = {
			kind: "InlineFragment",
			selections: v8 /*: any*/,
			type: "InvalidPasskeyRegistrationCredentialError",
			abstractKey: null,
		};
	return {
		fragment: {
			argumentDefinitions: [
				v0 /*: any*/,
				v1 /*: any*/,
				v2 /*: any*/,
				v3 /*: any*/,
				v4 /*: any*/,
				v5 /*: any*/,
			],
			kind: "Fragment",
			metadata: null,
			name: "PasskeyRegistrationMutation",
			selections: [
				{
					alias: null,
					args: v6 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "registerWithPasskey",
					plural: false,
					selections: [
						v7 /*: any*/,
						v9 /*: any*/,
						v10 /*: any*/,
						v11 /*: any*/,
						v12 /*: any*/,
					],
					storageKey: null,
				},
			],
			type: "Mutation",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: [
				v1 /*: any*/,
				v2 /*: any*/,
				v5 /*: any*/,
				v4 /*: any*/,
				v3 /*: any*/,
				v0 /*: any*/,
			],
			kind: "Operation",
			name: "PasskeyRegistrationMutation",
			selections: [
				{
					alias: null,
					args: v6 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "registerWithPasskey",
					plural: false,
					selections: [
						v7 /*: any*/,
						v9 /*: any*/,
						v10 /*: any*/,
						v11 /*: any*/,
						v12 /*: any*/,
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
			id: "63ace3e72963ccdfa082a6a24c5cec59",
			metadata: {},
			name: "PasskeyRegistrationMutation",
			operationKind: "mutation",
			text: null,
		},
	};
})();

(node as any).hash = "134974b59fded512e2644ff64eb7de15";

export default node;
