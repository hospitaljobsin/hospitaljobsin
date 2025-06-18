/**
 * @generated SignedSource<<ecdb95cb20161f56be92dbcbdcc734e5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageJobDetailMetadataFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly job: {
      readonly __typename: "Job";
      readonly description: string;
      readonly title: string;
    } | {
      // This will never be '%other', but we need some
      // value in case none of the concrete values match.
      readonly __typename: "%other";
    };
    readonly logoUrl: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "pageJobDetailMetadataFragment";
};
export type pageJobDetailMetadataFragment$key = {
  readonly " $data"?: pageJobDetailMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageJobDetailMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageJobDetailMetadataFragment"
};

(node as any).hash = "e0ed440db7fec8b0a34a227f885e0aed";

export default node;
