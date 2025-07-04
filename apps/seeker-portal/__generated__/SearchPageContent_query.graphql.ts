/**
 * @generated SignedSource<<77516f11602cbfc0ca843c0d19fa09a9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SearchPageContent_query$data = {
  readonly " $fragmentSpreads": FragmentRefs<"JobListFragment">;
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
      "name": "maxExperience"
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
      "name": "speciality"
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
          "name": "maxExperience",
          "variableName": "maxExperience"
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
          "variableName": "speciality"
        }
      ],
      "kind": "FragmentSpread",
      "name": "JobListFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "ed884a34dda2567c8c602338a64ed564";

export default node;
