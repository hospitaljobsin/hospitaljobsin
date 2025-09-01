/**
 * @generated SignedSource<<9a8f42123313e96a5f8ccd8599c517dc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageJobApplyServerFragment$data = {
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
  readonly " $fragmentType": "pageJobApplyServerFragment";
};
export type pageJobApplyServerFragment$key = {
  readonly " $data"?: pageJobApplyServerFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageJobApplyServerFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageJobApplyServerFragment"
};

(node as any).hash = "c7963b5a1fe2d55f26c86db9fa939039";

export default node;
