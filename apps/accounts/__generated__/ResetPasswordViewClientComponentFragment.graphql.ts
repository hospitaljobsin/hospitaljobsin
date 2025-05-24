/**
 * @generated SignedSource<<224efcd72729ca0e0ae7fc1a3a14ddd9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from "relay-runtime";
import type { FragmentRefs } from "relay-runtime";
export type ResetPasswordViewClientComponentFragment$data = {
	readonly passwordResetToken:
		| {
				readonly __typename: "PasswordResetToken";
				readonly " $fragmentSpreads": FragmentRefs<"ResetPasswordViewFragment">;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
	readonly " $fragmentType": "ResetPasswordViewClientComponentFragment";
};
export type ResetPasswordViewClientComponentFragment$key = {
	readonly " $data"?: ResetPasswordViewClientComponentFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"ResetPasswordViewClientComponentFragment">;
};

const node: ReaderFragment = {
	argumentDefinitions: [
		{
			defaultValue: null,
			kind: "LocalArgument",
			name: "email",
		},
		{
			defaultValue: null,
			kind: "LocalArgument",
			name: "resetToken",
		},
	],
	kind: "Fragment",
	metadata: null,
	name: "ResetPasswordViewClientComponentFragment",
	selections: [
		{
			alias: null,
			args: [
				{
					kind: "Variable",
					name: "email",
					variableName: "email",
				},
				{
					kind: "Variable",
					name: "resetToken",
					variableName: "resetToken",
				},
			],
			concreteType: null,
			kind: "LinkedField",
			name: "passwordResetToken",
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
							args: null,
							kind: "FragmentSpread",
							name: "ResetPasswordViewFragment",
						},
					],
					type: "PasswordResetToken",
					abstractKey: null,
				},
			],
			storageKey: null,
		},
	],
	type: "Query",
	abstractKey: null,
};

(node as any).hash = "ff421a3c7aba4c2239710b9ae954683e";

export default node;
