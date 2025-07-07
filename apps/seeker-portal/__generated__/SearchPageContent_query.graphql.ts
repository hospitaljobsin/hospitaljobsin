/**
 * @generated SignedSource<<9ea0bac010194449893945ff4a34ade6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SearchPageContent_query$data = {
  readonly " $fragmentSpreads": FragmentRefs<"SearchJobsListFragment">;
  readonly " $fragmentType": "SearchPageContent_query";
};
export type SearchPageContent_query$key = {
  readonly " $data"?: SearchPageContent_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"SearchPageContent_query">;
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
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "SearchPageContent_query",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "coordinates",
          "variableName": "coordinates"
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
        }
      ],
      "kind": "FragmentSpread",
      "name": "SearchJobsListFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "4753517b3c5c1ea44c79496d837b4db2";

export default node;
