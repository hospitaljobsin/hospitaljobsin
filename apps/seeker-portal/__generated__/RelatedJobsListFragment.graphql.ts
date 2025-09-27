/**
 * @generated SignedSource<<463749a36865c7aa27b0b23f0df020c4>>
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

(node as any).hash = "d4868444eea83628cfc725706963e071";

export default node;
