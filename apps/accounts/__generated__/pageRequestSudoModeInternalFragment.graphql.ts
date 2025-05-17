/**
 * @generated SignedSource<<1eb3def68c7f1c90a9caa73d07918cc7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageRequestSudoModeInternalFragment$data = {
  readonly viewer: {
    readonly __typename: "Account";
    readonly sudoModeExpiresAt: any | null | undefined;
  } | {
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
  "kind": "InlineDataFragment",
  "name": "pageRequestSudoModeInternalFragment"
};

(node as any).hash = "d87fa60d0f0db4e005cfa8acc7ec607c";

export default node;
