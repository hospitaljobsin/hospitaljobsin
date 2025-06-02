/**
 * @generated SignedSource<<d1e01f9240295189b754a4c6e5323e32>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageDashboardMetadataFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly description: string | null | undefined;
    readonly isMember: boolean;
    readonly logoUrl: string;
    readonly name: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "pageDashboardMetadataFragment";
};
export type pageDashboardMetadataFragment$key = {
  readonly " $data"?: pageDashboardMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageDashboardMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageDashboardMetadataFragment"
};

(node as any).hash = "8bcb4bdfecd1d1a48eb19dcf3162718f";

export default node;
