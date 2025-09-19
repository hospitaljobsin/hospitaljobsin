/**
 * @generated SignedSource<<2ef1b674402828bebf6c42e8d1f643b8>>
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
export type JobDetailsInternalFragment$data = {
  readonly createdAt: any;
  readonly currency: Currency;
  readonly description: string;
  readonly descriptionHtml: string;
  readonly isSalaryNegotiable: boolean;
  readonly location: string | null | undefined;
  readonly maxExperience: number | null | undefined;
  readonly maxSalary: number | null | undefined;
  readonly minExperience: number | null | undefined;
  readonly minSalary: number | null | undefined;
  readonly organization: {
    readonly description: string | null | undefined;
    readonly logoUrl: string;
    readonly name: string;
    readonly slug: string;
    readonly verificationStatus: {
      readonly __typename: string;
      readonly message?: string;
      readonly rejectedAt?: any;
      readonly requestedAt?: any;
      readonly verified: {
        readonly verifiedAt: any;
      } | null | undefined;
    };
  } | null | undefined;
  readonly skills: ReadonlyArray<string>;
  readonly slug: string;
  readonly title: string;
  readonly type: JobType | null | undefined;
  readonly vacancies: number | null | undefined;
  readonly workMode: WorkMode | null | undefined;
  readonly " $fragmentType": "JobDetailsInternalFragment";
};
export type JobDetailsInternalFragment$key = {
  readonly " $data"?: JobDetailsInternalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobDetailsInternalFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "JobDetailsInternalFragment"
};

(node as any).hash = "3459a9b9cb1b0c8fe9e3d61813846be9";

export default node;
