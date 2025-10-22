/**
 * @generated SignedSource<<9a616ed78b8fa4110400afc9c7a8b0ec>>
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
export type routeJobMarkdownFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly descriptionCleaned: string | null | undefined;
    readonly job: {
      readonly __typename: "Job";
      readonly createdAt: any;
      readonly currency: Currency;
      readonly descriptionCleaned: string;
      readonly isSalaryNegotiable: boolean;
      readonly isVisible: boolean;
      readonly location: string | null | undefined;
      readonly maxExperience: number | null | undefined;
      readonly maxSalary: number | null | undefined;
      readonly minExperience: number | null | undefined;
      readonly minSalary: number | null | undefined;
      readonly relatedJobs: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly currency: Currency;
            readonly location: string | null | undefined;
            readonly maxSalary: number | null | undefined;
            readonly minSalary: number | null | undefined;
            readonly slug: string;
            readonly title: string;
            readonly type: JobType | null | undefined;
            readonly workMode: WorkMode | null | undefined;
          };
        }>;
      };
      readonly skills: ReadonlyArray<string>;
      readonly title: string;
      readonly type: JobType | null | undefined;
      readonly vacancies: number | null | undefined;
      readonly workMode: WorkMode | null | undefined;
    } | {
      // This will never be '%other', but we need some
      // value in case none of the concrete values match.
      readonly __typename: "%other";
    };
    readonly location: string | null | undefined;
    readonly name: string;
    readonly slug: string;
    readonly website: string | null | undefined;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "routeJobMarkdownFragment";
};
export type routeJobMarkdownFragment$key = {
  readonly " $data"?: routeJobMarkdownFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"routeJobMarkdownFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "routeJobMarkdownFragment"
};

(node as any).hash = "d87a109b51730a29a9c5b7024c2ab938";

export default node;
