/**
 * @generated SignedSource<<c7d4fefdc4f645352ff7d5e4d0cbd95a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobMapViewFragment$data = {
  readonly jobs: {
    readonly totalCount: number | null | undefined;
  };
  readonly " $fragmentType": "JobMapViewFragment";
};
export type JobMapViewFragment$key = {
  readonly " $data"?: JobMapViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobMapViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "bounds"
    },
    {
      "kind": "RootArgument",
      "name": "first"
    },
    {
      "kind": "RootArgument",
      "name": "jobType"
    },
    {
      "kind": "RootArgument",
      "name": "location"
    },
    {
      "kind": "RootArgument",
      "name": "maxSalary"
    },
    {
      "kind": "RootArgument",
      "name": "minExperience"
    },
    {
      "kind": "RootArgument",
      "name": "minSalary"
    },
    {
      "kind": "RootArgument",
      "name": "proximityKm"
    },
    {
      "kind": "RootArgument",
      "name": "searchTerm"
    },
    {
      "kind": "RootArgument",
      "name": "sortBy"
    },
    {
      "kind": "RootArgument",
      "name": "workMode"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobMapViewFragment",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "bounds",
          "variableName": "bounds"
        },
        {
          "kind": "Variable",
          "name": "first",
          "variableName": "first"
        },
        {
          "kind": "Variable",
          "name": "jobType",
          "variableName": "jobType"
        },
        {
          "kind": "Variable",
          "name": "location",
          "variableName": "location"
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
      "concreteType": "JobConnection",
      "kind": "LinkedField",
      "name": "jobs",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "totalCount",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "ab64134d7dbb26ec8af5911aff3cf05e";

export default node;
