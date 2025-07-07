/**
 * @generated SignedSource<<42fd72fcff4148bb4adef0bbae74a1d7>>
 * @relayHash 817576fb010ec89f81840698b4f03f40
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 817576fb010ec89f81840698b4f03f40

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageJobDetailQuery$variables = {
  jobSlug: string;
  orgSlug: string;
};
export type pageJobDetailQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"JobAnalyticsTabFragment">;
};
export type pageJobDetailQuery = {
  response: pageJobDetailQuery$data;
  variables: pageJobDetailQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobSlug"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "orgSlug"
},
v2 = {
  "kind": "Variable",
  "name": "slug",
  "variableName": "orgSlug"
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v4 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "Node",
  "abstractKey": "__isNode"
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageJobDetailQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "jobSlug",
            "variableName": "jobSlug"
          },
          (v2/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "JobAnalyticsTabFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "pageJobDetailQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          (v2/*: any*/)
        ],
        "concreteType": null,
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isMember",
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Variable",
                    "name": "slug",
                    "variableName": "jobSlug"
                  }
                ],
                "concreteType": null,
                "kind": "LinkedField",
                "name": "job",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "viewCount",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "JobMetricPoint",
                        "kind": "LinkedField",
                        "name": "viewMetricPoints",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "timestamp",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "count",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "Job",
                    "abstractKey": null
                  },
                  (v4/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Organization",
            "abstractKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "817576fb010ec89f81840698b4f03f40",
    "metadata": {},
    "name": "pageJobDetailQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "4ac74736aff2149bc93793f70d4ccd79";

export default node;
