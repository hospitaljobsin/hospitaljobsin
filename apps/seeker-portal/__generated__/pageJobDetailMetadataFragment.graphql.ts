/**
 * @generated SignedSource<<8d2da3843c2dd4d19339c56ef9942418>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
export type JobType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type WorkMode = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type pageJobDetailMetadataFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly bannerUrl: string;
    readonly job: {
      readonly __typename: "Job";
      readonly applicantLocations: ReadonlyArray<string>;
      readonly createdAt: any;
      readonly descriptionCleaned: string;
      readonly descriptionHtml: string;
      readonly expiresAt: any | null | undefined;
      readonly isVisible: boolean;
      readonly location: string | null | undefined;
      readonly maxSalary: number | null | undefined;
      readonly minSalary: number | null | undefined;
      readonly slug: string;
      readonly title: string;
      readonly type: JobType | null | undefined;
      readonly workMode: WorkMode | null | undefined;
    } | {
      // This will never be '%other', but we need some
      // value in case none of the concrete values match.
      readonly __typename: "%other";
    };
    readonly location: string | null | undefined;
    readonly logoUrl: string;
    readonly name: string;
    readonly website: string | null | undefined;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "pageJobDetailMetadataFragment";
};
export type pageJobDetailMetadataFragment$key = {
  readonly " $data"?: pageJobDetailMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageJobDetailMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageJobDetailMetadataFragment"
};

(node as any).hash = "7c0754b8db29e13e31f023139e34a747";

export default node;
