/**
 * @generated SignedSource<<8aa01352d04ff0d19f870b12f1f2a1ff>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type FallbackJobsListFragment$data = {
  readonly jobs: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"JobFragment">;
      };
    }>;
  };
  readonly " $fragmentType": "FallbackJobsListFragment";
};
export type FallbackJobsListFragment$key = {
  readonly " $data"?: FallbackJobsListFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"FallbackJobsListFragment">;
};

import FallbackJobsListRefetchQuery_graphql from './FallbackJobsListRefetchQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "jobs"
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": 25,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
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
      "operation": FallbackJobsListRefetchQuery_graphql
    }
  },
  "name": "FallbackJobsListFragment",
  "selections": [
    {
      "alias": "jobs",
      "args": [
        {
          "kind": "Literal",
          "name": "jobType",
          "value": []
        },
        {
          "kind": "Literal",
          "name": "sortBy",
          "value": "RELEVANCE"
        },
        {
          "kind": "Literal",
          "name": "workMode",
          "value": []
        }
      ],
      "concreteType": "JobConnection",
      "kind": "LinkedField",
      "name": "__FallbackJobsListFragment_jobs_connection",
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
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "__FallbackJobsListFragment_jobs_connection(jobType:[],sortBy:\"RELEVANCE\",workMode:[])"
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "813bb43908eb64835f88ebd86b25f1de";

export default node;
