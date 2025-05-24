/**
 * @generated SignedSource<<3aa35eef085c6528619d5d0edd7d478a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from "relay-runtime";
export type GenderType = "FEMALE" | "MALE" | "OTHER" | "%future added value";
export type MaritalStatusType = "MARRIED" | "SINGLE" | "%future added value";

import type { FragmentRefs } from "relay-runtime";
export type UpdatePersonalDetailsFormFragment$data = {
	readonly profile:
		| {
				readonly __typename: "Profile";
				readonly address: {
					readonly city: string | null | undefined;
					readonly country: string | null | undefined;
					readonly line1: string | null | undefined;
					readonly line2: string | null | undefined;
					readonly pincode: string | null | undefined;
					readonly state: string | null | undefined;
				};
				readonly category: string | null | undefined;
				readonly dateOfBirth: any | null | undefined;
				readonly gender: GenderType | null | undefined;
				readonly maritalStatus: MaritalStatusType | null | undefined;
		  }
		| {
				readonly __typename: "ProfileNotFoundError";
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
	readonly " $fragmentType": "UpdatePersonalDetailsFormFragment";
};
export type UpdatePersonalDetailsFormFragment$key = {
	readonly " $data"?: UpdatePersonalDetailsFormFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"UpdatePersonalDetailsFormFragment">;
};

const node: ReaderFragment = (() => {
	var v0 = {
		alias: null,
		args: null,
		kind: "ScalarField",
		name: "__typename",
		storageKey: null,
	};
	return {
		argumentDefinitions: [],
		kind: "Fragment",
		metadata: null,
		name: "UpdatePersonalDetailsFormFragment",
		selections: [
			{
				alias: null,
				args: null,
				concreteType: null,
				kind: "LinkedField",
				name: "profile",
				plural: false,
				selections: [
					{
						kind: "InlineFragment",
						selections: [
							v0 /*: any*/,
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
					{
						kind: "InlineFragment",
						selections: [v0 /*: any*/],
						type: "ProfileNotFoundError",
						abstractKey: null,
					},
				],
				storageKey: null,
			},
		],
		type: "Account",
		abstractKey: null,
	};
})();

(node as any).hash = "f7ade31f5d97209699cf0d82c71e6d1f";

export default node;
