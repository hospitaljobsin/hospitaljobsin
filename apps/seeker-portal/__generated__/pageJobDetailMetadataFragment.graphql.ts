/**
 * @generated SignedSource<<d5bd77a64d415fabb4368bc9072f2413>>
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

(node as any).hash = "75a9ec11f2853fcd100670403eb85b4a";

export default node;
