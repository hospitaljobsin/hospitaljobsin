/**
 * @generated SignedSource<<3bfd9b20ab68817a78d15ab4fc65a346>>
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
    readonly pageInfo: {
      readonly endCursor: string | null | undefined;
      readonly hasNextPage: boolean;
    };
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

(node as any).hash = "0474efe7d7ed77216a46ca020e69834d";

export default node;
