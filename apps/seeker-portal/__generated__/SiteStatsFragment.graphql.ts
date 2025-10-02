/**
 * @generated SignedSource<<853db27742e88c0b3cbff67046e359ca>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SiteStatsFragment$data = {
  readonly stats: {
    readonly totalJobs: number;
    readonly totalOrganizations: number;
    readonly totalVacancies: number;
  };
  readonly " $fragmentType": "SiteStatsFragment";
};
export type SiteStatsFragment$key = {
  readonly " $data"?: SiteStatsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SiteStatsFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "SiteStatsFragment"
};

(node as any).hash = "84e3959e815334ab9bc154f43c9bf9fb";

export default node;
