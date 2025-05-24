/**
 * @generated SignedSource<<ddce80e8db7f43a7e952c7d28cf05e13>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from "relay-runtime";
import type { FragmentRefs } from "relay-runtime";
export type pageRequestSudoModeInternalFragment$data = {
	readonly viewer:
		| {
				readonly __typename: "Account";
				readonly sudoModeExpiresAt: any | null | undefined;
		  }
		| {
				// This will never be '%other', but we need some
				// value in case none of the concrete values match.
				readonly __typename: "%other";
		  };
	readonly " $fragmentType": "pageRequestSudoModeInternalFragment";
};
export type pageRequestSudoModeInternalFragment$key = {
	readonly " $data"?: pageRequestSudoModeInternalFragment$data;
	readonly " $fragmentSpreads": FragmentRefs<"pageRequestSudoModeInternalFragment">;
};

const node: ReaderInlineDataFragment = {
	kind: "InlineDataFragment",
	name: "pageRequestSudoModeInternalFragment",
};

(node as any).hash = "d87fa60d0f0db4e005cfa8acc7ec607c";

export default node;
