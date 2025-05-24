/**
 * @generated SignedSource<<bbd16102a39c02f340961b1ee6a7de0f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from "relay-runtime";
export type JobApplicantStatus =
	| "APPLIED"
	| "INTERVIEWED"
	| "OFFERED"
	| "ONHOLD"
	| "SHORTLISTED"
	| "%future added value";

import type { FragmentRefs } from "relay-runtime";
export type ApplicantDetailsFragment$data = {
	readonly account: {
		readonly avatarUrl: string;
		readonly email: string;
		readonly fullName: string;
		readonly profile:
			| {
					readonly __typename: "Profile";
					readonly address: {
						readonly city: string | null | undefined;
						readonly state: string | null | undefined;
					};
			  }
			| {
					readonly __typename: "ProfileNotFoundError";
					readonly __typename: "ProfileNotFoundError";
			  }
			| {
					// This will never be '%other', but we need some
					// value in case none of the concrete values match.
					readonly __typename: "%other";
			  };
	};
	readonly applicantFields: ReadonlyArray<{
		readonly fieldName: string;
		readonly fieldValue: string;
	}>;
	readonly resumeUrl: string;
	readonly status: JobApplicantStatus;
	readonly " $fragmentType": "ApplicantDetailsFragment";
};
export type ApplicantDetailsFragment$key = {
	readonly " $data"?: ApplicantDetailsFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"ApplicantDetailsFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [],
	kind: "Fragment",
	metadata: null,
	name: "ApplicantDetailsFragment",
	selections: [
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "status",
			storageKey: null,
		},
		{
			alias: null,
			args: null,
			kind: "ScalarField",
			name: "resumeUrl",
			storageKey: null,
		},
		{
			alias: null,
			args: null,
			concreteType: "ApplicantField",
			kind: "LinkedField",
			name: "applicantFields",
			plural: true,
			selections: [
				{
					alias: null,
					args: null,
					kind: "ScalarField",
					name: "fieldName",
					storageKey: null,
				},
				{
					alias: null,
					args: null,
					kind: "ScalarField",
					name: "fieldValue",
					storageKey: null,
				},
			],
			storageKey: null,
		},
		{
			kind: "RequiredField",
			field: {
				alias: null,
				args: null,
				concreteType: "Account",
				kind: "LinkedField",
				name: "account",
				plural: false,
				selections: [
					{
						alias: null,
						args: null,
						kind: "ScalarField",
						name: "fullName",
						storageKey: null,
					},
					{
						alias: null,
						args: null,
						kind: "ScalarField",
						name: "avatarUrl",
						storageKey: null,
					},
					{
						alias: null,
						args: null,
						kind: "ScalarField",
						name: "email",
						storageKey: null,
					},
					{
						alias: null,
						args: null,
						concreteType: null,
						kind: "LinkedField",
						name: "profile",
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
												name: "state",
												storageKey: null,
											},
										],
										storageKey: null,
									},
								],
								type: "Profile",
								abstractKey: null,
							},
						],
						storageKey: null,
					},
				],
				storageKey: null,
			},
			action: "THROW",
		},
	],
	type: "JobApplicant",
	abstractKey: null,
};

(node as any).hash = "1aeae37b063b179a77229f2380d3ef2d";

export default node;
