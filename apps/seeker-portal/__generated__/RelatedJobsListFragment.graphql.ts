/**
 * @generated SignedSource<<a828540c4572e84ba4559288e68a509f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type RelatedJobsListFragment$data = {
  readonly id: string;
  readonly relatedJobs: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"AuxiliaryJobFragment">;
      };
    }>;
    readonly pageInfo: {
      readonly hasNextPage: boolean;
    };
  };
  readonly " $fragmentType": "RelatedJobsListFragment";
};
export type RelatedJobsListFragment$key = {
  readonly " $data"?: RelatedJobsListFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RelatedJobsListFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "RelatedJobsListFragment"
};

(node as any).hash = "79b109471e62c552bad3af568d868322";

export default node;
