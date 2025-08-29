/**
 * @generated SignedSource<<4c1e3075ee9853e96a7002a472a3d054>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SearchJobsListFragment$data = {
  readonly viewer: {
    readonly " $fragmentSpreads": FragmentRefs<"JobControlsAuthFragment">;
  };
  readonly " $fragmentSpreads": FragmentRefs<"SearchJobsListInternalFragment">;
  readonly " $fragmentType": "SearchJobsListFragment";
};
export type SearchJobsListFragment$key = {
  readonly " $data"?: SearchJobsListFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SearchJobsListFragment">;
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
  "name": "SearchJobsListFragment",
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
      "name": "SearchJobsListInternalFragment"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "viewer",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "JobControlsAuthFragment"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "29247fe569df24c51e4b386b6c0f8a75";

export default node;
