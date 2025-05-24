/**
 * @generated SignedSource<<e7e6e0a165f748aa71f3741f16c45c30>>
 * @relayHash 2c07b1ee0e7fba70707a072561e76709
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 2c07b1ee0e7fba70707a072561e76709

import type { ConcreteRequest } from "relay-runtime";
export type Step1EmailFormMutation$variables = {
	captchaToken: string;
	email: string;
};
export type Step1EmailFormMutation$data = {
	readonly requestEmailVerificationToken:
		| {
				readonly __typename: "EmailInUseError";
				readonly message: string;
		  }
		| {
				readonly __typename: "EmailVerificationTokenCooldownError";
				readonly message: string;
				readonly remainingSeconds: number;
		  }
		| {
				readonly __typename: "InvalidCaptchaTokenError";
				readonly message: string;
		  }
		| {
				readonly __typename: "InvalidEmailError";
				readonly message: string;
		  }
		| {
				readonly __typename: "RequestEmailVerificationSuccess";
				readonly message: string;
				readonly remainingSeconds: number;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
};
export type Step1EmailFormMutation = {
	response: Step1EmailFormMutation$data;
	variables: Step1EmailFormMutation$variables;
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
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "message",
			storageKey: null,
		},
		v3 = [v2 /*: any*/],
		v4 = [
			v2 /*: any*/,
			{
				alias: null,
				args: null,
				kind: "ScalarField",
				name: "remainingSeconds",
				storageKey: null,
			},
		],
		v5 = [
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
				],
				concreteType: null,
				kind: "LinkedField",
				name: "requestEmailVerificationToken",
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
						type: "InvalidEmailError",
						abstractKey: null,
					},
					{
						kind: "InlineFragment",
						selections: v4 /*: any*/,
						type: "EmailVerificationTokenCooldownError",
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
						selections: v4 /*: any*/,
						type: "RequestEmailVerificationSuccess",
						abstractKey: null,
					},
				],
				storageKey: null,
			},
		];
	return {
		fragment: {
			argumentDefinitions: [v0 /*: any*/, v1 /*: any*/],
			kind: "Fragment",
			metadata: null,
			name: "Step1EmailFormMutation",
			selections: v5 /*: any*/,
			type: "Mutation",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: [v1 /*: any*/, v0 /*: any*/],
			kind: "Operation",
			name: "Step1EmailFormMutation",
			selections: v5 /*: any*/,
		},
		params: {
			id: "2c07b1ee0e7fba70707a072561e76709",
			metadata: {},
			name: "Step1EmailFormMutation",
			operationKind: "mutation",
			text: null,
		},
	};
})();

(node as any).hash = "60a13c0c1e5d353bd6d0b4428277022c";

export default node;
