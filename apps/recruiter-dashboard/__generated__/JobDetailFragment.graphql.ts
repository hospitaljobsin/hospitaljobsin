/**
 * @generated SignedSource<<782111ce455d5578ebc50a81ba4ecd15>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type Currency = "INR" | "%future added value";
export type JobType = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "PART_TIME" | "%future added value";
export type WorkMode = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type JobDetailFragment$data = {
  readonly applicationForm: {
    readonly __typename: "JobApplicationForm";
  } | null | undefined;
  readonly createdAt: any;
  readonly currency: Currency;
  readonly description: string | null | undefined;
  readonly externalApplicationUrl: string | null | undefined;
  readonly hasExperienceRange: boolean;
  readonly hasSalaryRange: boolean;
  readonly location: string | null | undefined;
  readonly maxExperience: number | null | undefined;
  readonly maxSalary: number | null | undefined;
  readonly minExperience: number | null | undefined;
  readonly minSalary: number | null | undefined;
  readonly organization: {
    readonly isAdmin: boolean;
  };
  readonly skills: ReadonlyArray<string>;
  readonly slug: string;
  readonly title: string;
  readonly type: JobType | null | undefined;
  readonly vacancies: number | null | undefined;
  readonly viewCount: number;
  readonly workMode: WorkMode | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"JobStatisticsFragment">;
  readonly " $fragmentType": "JobDetailFragment";
};
export type JobDetailFragment$key = {
  readonly " $data"?: JobDetailFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobDetailFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobDetailFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
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
      "name": "skills",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "viewCount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
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
      "name": "location",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "currency",
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
      "name": "hasSalaryRange",
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
      "name": "hasExperienceRange",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "externalApplicationUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "JobApplicationForm",
      "kind": "LinkedField",
      "name": "applicationForm",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__typename",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isAdmin",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      "action": "THROW"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "JobStatisticsFragment"
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "f3563422a5e1f4afc33b7eadaf52c2ad";

export default node;
