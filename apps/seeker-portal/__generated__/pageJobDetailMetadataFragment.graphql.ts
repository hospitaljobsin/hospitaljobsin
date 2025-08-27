/**
 * @generated SignedSource<<73c6e8fccbc6a99560b3a0726ed98481>>
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
    readonly description: string | null | undefined;
    readonly job: {
      readonly __typename: "Job";
      readonly address: {
        readonly addressLocality: string | null | undefined;
        readonly addressRegion: string | null | undefined;
        readonly country: string | null | undefined;
        readonly postalCode: string | null | undefined;
        readonly streetAddress: string | null | undefined;
      } | null | undefined;
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

(node as any).hash = "8c3c572dcc8ca1727b53b07904346ba0";

export default node;
