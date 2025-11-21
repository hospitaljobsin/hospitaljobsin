/**
 * @generated SignedSource<<5afeb4cbb2e62865f638b3bb9cb0cea0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobDetailsFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly job: {
      readonly __typename: "Job";
      readonly " $fragmentSpreads": FragmentRefs<"JobDetailsInternalFragment">;
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
    readonly __typename: string;
  };
  readonly " $fragmentType": "JobDetailsFragment";
};
export type JobDetailsFragment$key = {
  readonly " $data"?: JobDetailsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobDetailsFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "JobDetailsFragment"
};

(node as any).hash = "a1045db5629ef5a221d71355ec589948";

export default node;
