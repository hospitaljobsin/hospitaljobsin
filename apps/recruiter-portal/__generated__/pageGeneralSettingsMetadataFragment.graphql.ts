/**
 * @generated SignedSource<<1ce5b626ee2e4d0bfbd3edb967f1a6ca>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageGeneralSettingsMetadataFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly description: string | null | undefined;
    readonly isAdmin: boolean;
    readonly logoUrl: string;
    readonly name: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "pageGeneralSettingsMetadataFragment";
};
export type pageGeneralSettingsMetadataFragment$key = {
  readonly " $data"?: pageGeneralSettingsMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageGeneralSettingsMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageGeneralSettingsMetadataFragment"
};

(node as any).hash = "ada05cf52285c35e1ff095f593f4e367";

export default node;
