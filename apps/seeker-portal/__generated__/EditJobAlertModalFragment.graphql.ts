/**
 * @generated SignedSource<<bb920392d87c4124a2c0df881ad8baa6>>
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
export type EditJobAlertModalFragment$data = {
  readonly filters: {
    readonly jobType: ReadonlyArray<JobTypeFilter> | null | undefined;
    readonly location: string | null | undefined;
    readonly maxExperience: number | null | undefined;
    readonly maxSalary: number | null | undefined;
    readonly minExperience: number | null | undefined;
    readonly minSalary: number | null | undefined;
    readonly searchTerm: string;
    readonly workMode: ReadonlyArray<WorkMode> | null | undefined;
  };
  readonly frequency: JobAlertFrequency;
  readonly id: string;
  readonly " $fragmentType": "EditJobAlertModalFragment";
};
export type EditJobAlertModalFragment$key = {
  readonly " $data"?: EditJobAlertModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"EditJobAlertModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EditJobAlertModalFragment",
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
      "concreteType": "AlertFilters",
      "kind": "LinkedField",
      "name": "filters",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "searchTerm",
          "storageKey": null
        },
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
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "frequency",
      "storageKey": null
    }
  ],
  "type": "JobAlert",
  "abstractKey": null
};

(node as any).hash = "845477b95b22834ca5743c00b4343911";

export default node;
