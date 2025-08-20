/**
 * @generated SignedSource<<821eacaa42975449aa040f938b9a1647>>
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
    readonly bannerUrl: string;
    readonly job: {
      readonly __typename: "Job";
      readonly descriptionCleaned: string;
      readonly isVisible: boolean;
      readonly title: string;
    } | {
      // This will never be '%other', but we need some
      // value in case none of the concrete values match.
      readonly __typename: "%other";
    };
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

(node as any).hash = "3345b9a7982910553fdec77ae6535c65";

export default node;
