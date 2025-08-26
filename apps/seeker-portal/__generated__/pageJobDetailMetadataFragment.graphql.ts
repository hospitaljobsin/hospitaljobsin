/**
 * @generated SignedSource<<c2ce787e9959b31790476541a5b66183>>
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
      readonly address: {
        readonly addressLocality: string | null | undefined;
        readonly addressRegion: string | null | undefined;
        readonly country: string | null | undefined;
        readonly postalCode: string | null | undefined;
        readonly streetAddress: string | null | undefined;
      };
      readonly applicantLocations: ReadonlyArray<string>;
      readonly createdAt: any;
      readonly descriptionCleaned: string;
      readonly descriptionHtml: string;
      readonly expiresAt: any | null | undefined;
      readonly isVisible: boolean;
      readonly location: string;
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

(node as any).hash = "08198ebf95009d9d8e92d10c9cc45644";

export default node;
