/**
 * @generated SignedSource<<fc18633611ae41bd03662db4d93a5d12>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobDetailViewFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly job: {
      readonly __typename: "Job";
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"RelatedJobsListFragment">;
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
  readonly " $fragmentSpreads": FragmentRefs<"JobDetailsFragment">;
  readonly " $fragmentType": "JobDetailViewFragment";
};
export type JobDetailViewFragment$key = {
  readonly " $data"?: JobDetailViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobDetailViewFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "JobDetailViewFragment"
};

(node as any).hash = "f3fc49c326e9ce0afef72a0d1e0370f4";

export default node;
