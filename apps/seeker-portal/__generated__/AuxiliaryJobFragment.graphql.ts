/**
 * @generated SignedSource<<a82f16994efe8d5e6a91e037833baae1>>
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
export type AuxiliaryJobFragment$data = {
  readonly currency: Currency;
  readonly location: string | null | undefined;
  readonly maxExperience: number | null | undefined;
  readonly maxSalary: number | null | undefined;
  readonly minExperience: number | null | undefined;
  readonly minSalary: number | null | undefined;
  readonly organization: {
    readonly logoUrl?: string;
    readonly name?: string;
    readonly slug: string;
    readonly verificationStatus: {
      readonly __typename: string;
      readonly verified: {
        readonly verifiedAt: any;
      } | null | undefined;
    };
  } | null | undefined;
  readonly skills: ReadonlyArray<string>;
  readonly slug: string;
  readonly title: string;
  readonly type: JobType | null | undefined;
  readonly workMode: WorkMode | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"JobControlsFragment">;
  readonly " $fragmentType": "AuxiliaryJobFragment";
};
export type AuxiliaryJobFragment$key = {
  readonly " $data"?: AuxiliaryJobFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AuxiliaryJobFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "AuxiliaryJobFragment"
};

(node as any).hash = "bb2ffd5f9098caa31116079f47519020";

export default node;
