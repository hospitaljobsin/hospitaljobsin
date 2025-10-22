/**
 * @generated SignedSource<<05e7d949b0dc20ea60d8db54b2b36e27>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
export type Currency = "INR" | "%future added value";
export type JobType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type WorkMode = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type routeSearchMarkdownFragment$data = {
  readonly jobs: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly createdAt: any;
        readonly currency: Currency;
        readonly id: string;
        readonly location: string | null | undefined;
        readonly maxExperience: number | null | undefined;
        readonly maxSalary: number | null | undefined;
        readonly minExperience: number | null | undefined;
        readonly minSalary: number | null | undefined;
        readonly organization: {
          readonly name: string;
          readonly slug: string;
        } | null | undefined;
        readonly slug: string;
        readonly title: string;
        readonly type: JobType | null | undefined;
        readonly workMode: WorkMode | null | undefined;
      };
    }>;
    readonly totalCount: number | null | undefined;
  };
  readonly " $fragmentType": "routeSearchMarkdownFragment";
};
export type routeSearchMarkdownFragment$key = {
  readonly " $data"?: routeSearchMarkdownFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"routeSearchMarkdownFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "routeSearchMarkdownFragment"
};

(node as any).hash = "d952f53bf716095bb70d04ff96026812";

export default node;
