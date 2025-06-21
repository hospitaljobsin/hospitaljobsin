/**
 * @generated SignedSource<<a96bf8d926ee0113f052b9acb803ccca>>
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
    readonly job: {
      readonly __typename: "Job";
      readonly description: string;
      readonly externalApplicationUrl: string | null | undefined;
      readonly isApplied: boolean;
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

(node as any).hash = "89b5eb6b30dd467cd330f286856a4e62";

export default node;
