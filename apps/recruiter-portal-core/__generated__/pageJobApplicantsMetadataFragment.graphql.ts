/**
 * @generated SignedSource<<a2279d188d88c0c9006bbea262fdecd2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageJobApplicantsMetadataFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly description: string | null | undefined;
    readonly isMember: boolean;
    readonly job: {
      readonly __typename: "Job";
      readonly title: string;
    } | {
      // This will never be '%other', but we need some
      // value in case none of the concrete values match.
      readonly __typename: "%other";
    };
    readonly logoUrl: string;
    readonly name: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "pageJobApplicantsMetadataFragment";
};
export type pageJobApplicantsMetadataFragment$key = {
  readonly " $data"?: pageJobApplicantsMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageJobApplicantsMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageJobApplicantsMetadataFragment"
};

(node as any).hash = "2e810d81943adf2ea270e6e046881a89";

export default node;
