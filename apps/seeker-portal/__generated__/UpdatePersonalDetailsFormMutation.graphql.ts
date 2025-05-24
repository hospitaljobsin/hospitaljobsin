import type { ConcreteRequest, FragmentRefs } from "relay-runtime";
export type GenderType = "FEMALE" | "MALE" | "OTHER" | "%future added value";
export type MaritalStatusType = "MARRIED" | "SINGLE" | "%future added value";
export type AddressInput = {
	city?: string | null | undefined;
	country?: string | null | undefined;
	line1?: string | null | undefined;
	line2?: string | null | undefined;
	pincode?: string | null | undefined;
	state?: string | null | undefined;
};
export type UpdatePersonalDetailsFormMutation$variables = {
	address: AddressInput;
	category?: string | null | undefined;
	dateOfBirth?: any | null | undefined;
	gender?: GenderType | null | undefined;
	maritalStatus?: MaritalStatusType | null | undefined;
};
export type UpdatePersonalDetailsFormMutation$data = {
	readonly updateProfilePersonalDetails: {
		readonly " $fragmentSpreads": FragmentRefs<"UpdatePersonalDetailsFormFragment">;
	};
};
export type UpdatePersonalDetailsFormMutation = {
	response: UpdatePersonalDetailsFormMutation$data;
	variables: UpdatePersonalDetailsFormMutation$variables;
};

const node: ConcreteRequest = (() => {
	var v0 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "address",
		},
		v1 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "category",
		},
		v2 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "dateOfBirth",
		},
		v3 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "gender",
		},
		v4 = {
			defaultValue: null,
			kind: "LocalArgument",
			name: "maritalStatus",
		},
		v5 = [
			{
				kind: "Variable",
				name: "address",
				variableName: "address",
			},
			{
				kind: "Variable",
				name: "category",
				variableName: "category",
			},
			{
				kind: "Variable",
				name: "dateOfBirth",
				variableName: "dateOfBirth",
			},
			{
				kind: "Variable",
				name: "gender",
				variableName: "gender",
			},
			{
				kind: "Variable",
				name: "maritalStatus",
				variableName: "maritalStatus",
			},
		],
		v6 = {
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "__typename",
			storageKey: null,
		},
		v7 = {
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
		};
	return {
		fragment: {
			argumentDefinitions: [
				v0 /*: any*/,
				v1 /*: any*/,
				v2 /*: any*/,
				v3 /*: any*/,
				v4 /*: any*/,
			],
			kind: "Fragment",
			metadata: null,
			name: "UpdatePersonalDetailsFormMutation",
			selections: [
				{
					alias: null,
					args: v5 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "updateProfilePersonalDetails",
					plural: false,
					selections: [
						{
							kind: "InlineFragment",
							selections: [
								{
									args: null,
									kind: "FragmentSpread",
									name: "UpdatePersonalDetailsFormFragment",
								},
							],
							type: "Account",
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
			argumentDefinitions: [
				v3 /*: any*/,
				v2 /*: any*/,
				v0 /*: any*/,
				v4 /*: any*/,
				v1 /*: any*/,
			],
			kind: "Operation",
			name: "UpdatePersonalDetailsFormMutation",
			selections: [
				{
					alias: null,
					args: v5 /*: any*/,
					concreteType: null,
					kind: "LinkedField",
					name: "updateProfilePersonalDetails",
					plural: false,
					selections: [
						v6 /*: any*/,
						{
							kind: "InlineFragment",
							selections: [
								{
									alias: null,
									args: null,
									concreteType: null,
									kind: "LinkedField",
									name: "profile",
									plural: false,
									selections: [
										v6 /*: any*/,
										{
											kind: "InlineFragment",
											selections: [
												{
													alias: null,
													args: null,
													concreteType: "Address",
													kind: "LinkedField",
													name: "address",
													plural: false,
													selections: [
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "city",
															storageKey: null,
														},
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "country",
															storageKey: null,
														},
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "line1",
															storageKey: null,
														},
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "line2",
															storageKey: null,
														},
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "pincode",
															storageKey: null,
														},
														{
															alias: null,
															args: null,
															kind: "ScalarField",
															name: "state",
															storageKey: null,
														},
													],
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "gender",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "dateOfBirth",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "maritalStatus",
													storageKey: null,
												},
												{
													alias: null,
													args: null,
													kind: "ScalarField",
													name: "category",
													storageKey: null,
												},
											],
											type: "Profile",
											abstractKey: null,
										},
										v7 /*: any*/,
									],
									storageKey: null,
								},
							],
							type: "Account",
							abstractKey: null,
						},
						v7 /*: any*/,
					],
					storageKey: null,
				},
			],
		},
		params: {
			id: "498c8a428c2095f913eb2306ce089613",
			metadata: {},
			name: "UpdatePersonalDetailsFormMutation",
			operationKind: "mutation",
			text: null,
		},
	};
})();

(node as any).hash = "e50a4e07c6a72abb97481461cd4b632d";

export default node;
