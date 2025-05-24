/**
 * @generated SignedSource<<cd41ae70813d0e8134a38560cdff918e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AppliedJobsListInternalFragment$data = {
  readonly appliedJobs: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly job: {
          readonly " $fragmentSpreads": FragmentRefs<"JobFragment">;
        };
      };
    }>;
    readonly pageInfo: {
      readonly hasNextPage: boolean;
    };
  };
  readonly " $fragmentType": "AppliedJobsListInternalFragment";
};
export type AppliedJobsListInternalFragment$key = {
  readonly " $data"?: AppliedJobsListInternalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AppliedJobsListInternalFragment">;
};

import AppliedJobsListPaginationQuery_graphql from './AppliedJobsListPaginationQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "appliedJobs"
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
      "operation": AppliedJobsListPaginationQuery_graphql
    }
  },
  "name": "AppliedJobsListInternalFragment",
  "selections": [
    {
      "alias": "appliedJobs",
      "args": null,
      "concreteType": "JobApplicantConnection",
      "kind": "LinkedField",
      "name": "__AppliedJobListFragment_appliedJobs_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "JobApplicantEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "JobApplicant",
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
                  "kind": "RequiredField",
                  "field": {
                    "alias": null,
                    "args": null,
                    "concreteType": "Job",
                    "kind": "LinkedField",
                    "name": "job",
                    "plural": false,
                    "selections": [
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "JobFragment"
                      }
                    ],
                    "storageKey": null
                  },
                  "action": "THROW"
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

(node as any).hash = "811d86a1cfb5e2c8d1251ab3d634ac76";

export default node;
