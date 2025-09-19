/**
 * @generated SignedSource<<0973cdbee4e4101c46782215f7ac2209>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type TrendingJobListFragment$data = {
  readonly trendingJobs: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"AuxiliaryJobFragment" | "JobControlsFragment">;
      };
    }>;
    readonly pageInfo: {
      readonly hasNextPage: boolean;
    };
  };
  readonly " $fragmentType": "TrendingJobListFragment";
};
export type TrendingJobListFragment$key = {
  readonly " $data"?: TrendingJobListFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"TrendingJobListFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "TrendingJobListFragment"
};

(node as any).hash = "5bd0a880cd9e93b464a77dbd3e4236e4";

export default node;
