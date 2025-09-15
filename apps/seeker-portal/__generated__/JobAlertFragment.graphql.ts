/**
 * @generated SignedSource<<a82b8d3863cfad5bbe1ca1c3bcb0c748>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type JobAlertFrequency = "DAILY" | "MONTHLY" | "WEEKLY" | "%future added value";
export type JobTypeFilter = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type WorkMode = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type JobAlertFragment$data = {
  readonly createdAt: any;
  readonly filters: {
    readonly jobType: ReadonlyArray<JobTypeFilter> | null | undefined;
    readonly location: string | null | undefined;
    readonly maxExperience: number | null | undefined;
    readonly maxSalary: number | null | undefined;
    readonly minExperience: number | null | undefined;
    readonly minSalary: number | null | undefined;
    readonly searchTerm: string | null | undefined;
    readonly workMode: ReadonlyArray<WorkMode> | null | undefined;
  };
  readonly frequency: JobAlertFrequency;
  readonly id: string;
  readonly " $fragmentType": "JobAlertFragment";
};
export type JobAlertFragment$key = {
  readonly " $data"?: JobAlertFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobAlertFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobAlertFragment",
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
      "name": "createdAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "frequency",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AlertFilters",
      "kind": "LinkedField",
      "name": "filters",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "jobType",
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
          "name": "maxExperience",
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
          "name": "maxSalary",
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
          "name": "searchTerm",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "JobAlert",
  "abstractKey": null
};

(node as any).hash = "ba28dc51b8b5e217c0abdbe6185bf694";

export default node;
