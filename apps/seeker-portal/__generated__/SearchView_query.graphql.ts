/**
 * @generated SignedSource<<02cf47e38c5aa3b638d725988e4cff74>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SearchView_query$data = {
  readonly " $fragmentSpreads": FragmentRefs<"SearchHeaderFragment" | "SearchJobsListFragment">;
  readonly " $fragmentType": "SearchView_query";
};
export type SearchView_query$key = {
  readonly " $data"?: SearchView_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"SearchView_query">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "coordinates"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "jobType"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "maxSalary"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "minExperience"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "minSalary"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "proximityKm"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "searchTerm"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "workMode"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "SearchView_query",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SearchHeaderFragment"
    },
    {
      "args": [
        {
          "kind": "Variable",
          "name": "coordinates",
          "variableName": "coordinates"
        },
        {
          "kind": "Variable",
          "name": "jobType",
          "variableName": "jobType"
        },
        {
          "kind": "Variable",
          "name": "maxSalary",
          "variableName": "maxSalary"
        },
        {
          "kind": "Variable",
          "name": "minExperience",
          "variableName": "minExperience"
        },
        {
          "kind": "Variable",
          "name": "minSalary",
          "variableName": "minSalary"
        },
        {
          "kind": "Variable",
          "name": "proximityKm",
          "variableName": "proximityKm"
        },
        {
          "kind": "Variable",
          "name": "searchTerm",
          "variableName": "searchTerm"
        },
        {
          "kind": "Variable",
          "name": "workMode",
          "variableName": "workMode"
        }
      ],
      "kind": "FragmentSpread",
      "name": "SearchJobsListFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "5769d7f2523c9ccd9dce6f03a48909b2";

export default node;
