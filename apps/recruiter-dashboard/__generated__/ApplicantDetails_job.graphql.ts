/**
 * @generated SignedSource<<e142c9f2086b33263b3ca9aa858899a2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type JobType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type WorkMode = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type ApplicantDetails_job$data = {
  readonly applicantCount: {
    readonly applied: number;
    readonly interviewed: number;
    readonly offered: number;
    readonly onHold: number;
    readonly shortlisted: number;
  } | null | undefined;
  readonly description: string;
  readonly id: string;
  readonly location: string | null | undefined;
  readonly maxExperience: number | null | undefined;
  readonly maxSalary: number | null | undefined;
  readonly minExperience: number | null | undefined;
  readonly minSalary: number | null | undefined;
  readonly skills: ReadonlyArray<string>;
  readonly title: string;
  readonly type: JobType | null | undefined;
  readonly vacancies: number | null | undefined;
  readonly workMode: WorkMode | null | undefined;
  readonly " $fragmentType": "ApplicantDetails_job";
};
export type ApplicantDetails_job$key = {
  readonly " $data"?: ApplicantDetails_job$data;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantDetails_job">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ApplicantDetails_job",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "minExperience",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "maxExperience",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "minSalary",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "maxSalary",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "location",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "skills",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "type",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "workMode",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "vacancies",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "JobApplicantCount",
      "kind": "LinkedField",
      "name": "applicantCount",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "applied",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "interviewed",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "offered",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "onHold",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "shortlisted",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "0cea4d8f3b442e7eda70ff64c3895c99";

export default node;
