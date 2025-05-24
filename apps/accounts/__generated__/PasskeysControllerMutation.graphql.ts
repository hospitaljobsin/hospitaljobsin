import type { ConcreteRequest, FragmentRefs } from "relay-runtime";
export type PasskeysControllerMutation$variables = {
	connections: ReadonlyArray<string>;
	nickname: string;
	passkeyRegistrationResponse: any;
};
export type PasskeysControllerMutation$data = {
	readonly createWebAuthnCredential:
		| {
				readonly __typename: "CreateWebAuthnCredentialSuccess";
				readonly webAuthnCredentialEdge: {
					readonly cursor: string;
					readonly node: {
						readonly id: string;
						readonly " $fragmentSpreads": FragmentRefs<"PasskeyFragment">;
					};
				};
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
export type PasskeysControllerMutation = {
	response: PasskeysControllerMutation$data;
	variables: PasskeysControllerMutation$variables;
};

const node: ConcreteRequest = (() => {
	var v0 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "connections",
		},
		v1 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "nickname",
		},
		v2 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "passkeyRegistrationResponse",
		},
		v3 = [
			{
				kind: "Variable",
				name: "nickname",
				variableName: "nickname",
			},
			{
				kind: "Variable",
				name: "passkeyRegistrationResponse",
				variableName: "passkeyRegistrationResponse",
			},
		],
		v4 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "__typename",
			storageKey: null,
		},
		v5 = {
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
			type: "InvalidPasskeyRegistrationCredentialError",
			abstractKey: null,
		},
		v6 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "cursor",
			storageKey: null,
		},
		v7 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "id",
			storageKey: null,
		};
	return {
		fragment: {
			argumentDefinitions: [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/],
			kind: "Fragment",
			metadata: null,
			name: "PasskeysControllerMutation",
			selections: [
				{
					alias: null,
					args: v3 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "createWebAuthnCredential",
					plural: false,
					selections: [
						v4 /*: any*/,
						v5 /*: any*/,
						{
							kind: "InlineFragment",
							selections: [
								{
									alias: null,
									args: null,
									concreteType: "WebAuthnCredentialEdge",
									kind: "LinkedField",
									name: "webAuthnCredentialEdge",
									plural: false,
									selections: [
										v6 /*: any*/,
										{
											alias: null,
											args: null,
											concreteType: "WebAuthnCredential",
											kind: "LinkedField",
											name: "node",
											plural: false,
											selections: [
												v7 /*: any*/,
												{
													args: null,
													kind: "FragmentSpread",
													name: "PasskeyFragment",
												},
											],
											storageKey: null,
										},
									],
									storageKey: null,
								},
							],
							type: "CreateWebAuthnCredentialSuccess",
							abstractKey: null,
						},
					],
					storageKey: null,
				},
			],
			type: "Mutation",
			abstractKey: null,
		},
		kind: "Request",
		operation: {
			argumentDefinitions: [v1 /*: any*/, v2 /*: any*/, v0 /*: any*/],
			kind: "Operation",
			name: "PasskeysControllerMutation",
			selections: [
				{
					alias: null,
					args: v3 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "createWebAuthnCredential",
					plural: false,
					selections: [
						v4 /*: any*/,
						v5 /*: any*/,
						{
							kind: "InlineFragment",
							selections: [
								{
									alias: null,
									args: null,
									concreteType: "WebAuthnCredentialEdge",
									kind: "LinkedField",
									name: "webAuthnCredentialEdge",
									plural: false,
									selections: [
										v6 /*: any*/,
										{
											alias: null,
											args: null,
											concreteType: "WebAuthnCredential",
											kind: "LinkedField",
											name: "node",
											plural: false,
											selections: [
												v7 /*: any*/,
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "nickname",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "createdAt",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "lastUsedAt",
													storageKey: null,
												},
											],
											storageKey: null,
										},
									],
									storageKey: null,
								},
								{
									alias: null,
									args: null,
									filters: null,
									handle: "prependEdge",
									key: "",
									kind: "LinkedHandle",
									name: "webAuthnCredentialEdge",
									handleArgs: [
										{
											kind: "Variable",
											name: "connections",
											variableName: "connections",
										},
									],
								},
							],
							type: "CreateWebAuthnCredentialSuccess",
							abstractKey: null,
						},
					],
					storageKey: null,
				},
			],
		},
		params: {
			id: "a6f1b1e285835c4a88c9791813d93485",
			metadata: {},
			name: "PasskeysControllerMutation",
			operationKind: "mutation",
			text: null,
		},
	};
})();

(node as any).hash = "db1fbe0237732926f7a636882ec12beb";

export default node;
