import type { ConcreteRequest, FragmentRefs } from "relay-runtime";
export type AuthenticatorTwoFactorAuthenticationResetPasswordMutation$variables =
	{
		captchaToken: string;
		email: string;
		passwordResetToken: string;
		twoFactorToken: string;
	};
export type AuthenticatorTwoFactorAuthenticationResetPasswordMutation$data = {
	readonly verify2faPasswordResetWithAuthenticator:
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
				readonly __typename: "InvalidPasswordResetTokenError";
				readonly message: string;
		  }
		| {
				readonly __typename: "PasswordResetToken";
				readonly " $fragmentSpreads": FragmentRefs<"ResetPasswordViewFragment">;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
};
export type AuthenticatorTwoFactorAuthenticationResetPasswordMutation = {
	response: AuthenticatorTwoFactorAuthenticationResetPasswordMutation$data;
	variables: AuthenticatorTwoFactorAuthenticationResetPasswordMutation$variables;
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
			name: "passwordResetToken",
		},
		v3 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "twoFactorToken",
		},
		v4 = [
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
				name: "passwordResetToken",
				variableName: "passwordResetToken",
			},
			{
				kind: "Variable",
				name: "twoFactorToken",
				variableName: "twoFactorToken",
			},
		],
		v5 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "__typename",
			storageKey: null,
		},
		v6 = [
			{
				alias: null,
				args: null,
				kind: "ScalarField",
				name: "message",
				storageKey: null,
			},
		],
		v7 = {
			kind: "InlineFragment",
			selections: v6 /*: any*/,
			type: "InvalidPasswordResetTokenError",
			abstractKey: null,
		},
		v8 = {
			kind: "InlineFragment",
			selections: v6 /*: any*/,
			type: "InvalidCredentialsError",
			abstractKey: null,
		},
		v9 = {
			kind: "InlineFragment",
			selections: v6 /*: any*/,
			type: "AuthenticatorNotEnabledError",
			abstractKey: null,
		},
		v10 = {
			kind: "InlineFragment",
			selections: v6 /*: any*/,
			type: "InvalidCaptchaTokenError",
			abstractKey: null,
		},
		v11 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "id",
			storageKey: null,
		};
	return {
		fragment: {
			argumentDefinitions: [
				v0 /*: any*/,
				v1 /*: any*/,
				v2 /*: any*/,
				v3 /*: any*/,
			],
			kind: "Fragment",
			metadata: null,
			name: "AuthenticatorTwoFactorAuthenticationResetPasswordMutation",
			selections: [
				{
					alias: null,
					args: v4 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "verify2faPasswordResetWithAuthenticator",
					plural: false,
					selections: [
						v5 /*: any*/,
						{
							kind: "InlineFragment",
							selections: [
								{
									args: null,
									kind: "FragmentSpread",
									name: "ResetPasswordViewFragment",
								},
							],
							type: "PasswordResetToken",
							abstractKey: null,
						},
						v7 /*: any*/,
						v8 /*: any*/,
						v9 /*: any*/,
						v10 /*: any*/,
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
				v3 /*: any*/,
				v0 /*: any*/,
			],
			kind: "Operation",
			name: "AuthenticatorTwoFactorAuthenticationResetPasswordMutation",
			selections: [
				{
					alias: null,
					args: v4 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "verify2faPasswordResetWithAuthenticator",
					plural: false,
					selections: [
						v5 /*: any*/,
						{
							kind: "InlineFragment",
							selections: [
								v11 /*: any*/,
								{
									alias: null,
									args: null,
									kind: "ScalarField",
									name: "needs2fa",
									storageKey: null,
								},
								{
									alias: null,
									args: null,
									kind: "ScalarField",
									name: "twoFactorProviders",
									storageKey: null,
								},
								{
									alias: null,
									args: null,
									kind: "ScalarField",
									name: "authProviders",
									storageKey: null,
								},
							],
							type: "PasswordResetToken",
							abstractKey: null,
						},
						v7 /*: any*/,
						v8 /*: any*/,
						v9 /*: any*/,
						v10 /*: any*/,
						{
							kind: "InlineFragment",
							selections: [v11 /*: any*/],
							type: "Node",
							abstractKey: "__isNode",
						},
					],
					storageKey: null,
				},
			],
		},
		params: {
			id: "7757796071d5cff7faf064c272efc0f7",
			metadata: {},
			name: "AuthenticatorTwoFactorAuthenticationResetPasswordMutation",
			operationKind: "mutation",
			text: null,
		},
	};
})();

(node as any).hash = "947606180dd40bf770c67d85b80d66e4";

export default node;
