/**
 * @generated SignedSource<<df6c5194646b3f2cf0e90ac1c8e9f27b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SearchViewLocationSpecialityClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"SearchView_query">;
  readonly " $fragmentType": "SearchViewLocationSpecialityClientComponentFragment";
};
export type SearchViewLocationSpecialityClientComponentFragment$key = {
  readonly " $data"?: SearchViewLocationSpecialityClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SearchViewLocationSpecialityClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
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
      "name": "sortBy"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "workMode"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "SearchViewLocationSpecialityClientComponentFragment",
  "selections": [
    {
      "args": [
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
          "name": "sortBy",
          "variableName": "sortBy"
        },
        {
          "kind": "Variable",
          "name": "workMode",
          "variableName": "workMode"
        }
      ],
      "kind": "FragmentSpread",
      "name": "SearchView_query"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "ddcf7d92a64308594290c2ade4b94007";

export default node;
