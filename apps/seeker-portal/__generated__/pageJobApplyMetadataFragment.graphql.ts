/**
 * @generated SignedSource<<2dab88591215b8d47fa789574e3b8077>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageJobApplyMetadataFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly bannerUrl: string;
    readonly job: {
      readonly __typename: "Job";
      readonly description: string;
      readonly externalApplicationUrl: string | null | undefined;
      readonly isApplied: boolean;
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
  readonly viewer: {
    readonly __typename: "Account";
    readonly profile: {
      readonly isComplete: boolean;
    } | null | undefined;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "pageJobApplyMetadataFragment";
};
export type pageJobApplyMetadataFragment$key = {
  readonly " $data"?: pageJobApplyMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageJobApplyMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageJobApplyMetadataFragment"
};

(node as any).hash = "d4fb7c6f3079178bdd40faceb284fe73";

export default node;
