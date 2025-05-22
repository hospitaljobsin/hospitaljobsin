/**
 * @generated SignedSource<<446a05a9860135de2023e21c6d0a130a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pagePasswordResetTokenMetadataFragment$data = {
  readonly passwordResetToken: {
    readonly __typename: string;
  };
  readonly " $fragmentType": "pagePasswordResetTokenMetadataFragment";
};
export type pagePasswordResetTokenMetadataFragment$key = {
  readonly " $data"?: pagePasswordResetTokenMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pagePasswordResetTokenMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pagePasswordResetTokenMetadataFragment"
};

(node as any).hash = "327fa631a63cab0bbdfef65bbeeda1b2";

export default node;
