/**
 * @generated SignedSource<<facb872f0a21d0b95d88098696a9c241>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobListInternalFragment$data = {
  readonly jobs: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"JobControlsFragment" | "JobFragment">;
      };
    }>;
    readonly pageInfo: {
      readonly hasNextPage: boolean;
    };
  };
  readonly " $fragmentType": "JobListInternalFragment";
};
export type JobListInternalFragment$key = {
  readonly " $data"?: JobListInternalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobListInternalFragment">;
};

import JobListRefetchQuery_graphql from './JobListRefetchQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "jobs"
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": 10,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "jobType"
    },
    {
      "defaultValue": "UPDATED_AT",
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
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "count",
          "cursor": "cursor"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [],
      "operation": JobListRefetchQuery_graphql
    }
  },
  "name": "JobListInternalFragment",
  "selections": [
    {
      "alias": "jobs",
      "args": [
        {
          "kind": "Variable",
          "name": "jobType",
          "variableName": "jobType"
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
      "name": "__JobListFragment_jobs_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "JobEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Job",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "JobFragment"
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "JobControlsFragment"
                },
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
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "0454efb57e117e10d6cea17f9237aeb9";

export default node;
