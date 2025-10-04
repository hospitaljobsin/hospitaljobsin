/**
 * @generated SignedSource<<41759082fa40b2c26d60c49497c8526e>>
 * @relayHash f0c6965a5f3c015f615bab3e1a969710
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID f0c6965a5f3c015f615bab3e1a969710

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateResumeFormRecommendedJobAlertsQuery$variables = Record<PropertyKey, never>;
export type UpdateResumeFormRecommendedJobAlertsQuery$data = {
  readonly recommendedJobAlerts: {
    readonly totalCount: number;
  };
  readonly " $fragmentSpreads": FragmentRefs<"RecommendedJobAlertsFragment">;
};
export type UpdateResumeFormRecommendedJobAlertsQuery = {
  response: UpdateResumeFormRecommendedJobAlertsQuery$data;
  variables: UpdateResumeFormRecommendedJobAlertsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateResumeFormRecommendedJobAlertsQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "RecommendedJobAlertsFragment"
      },
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "RecommendedJobAlertConnection",
        "kind": "LinkedField",
        "name": "recommendedJobAlerts",
        "plural": false,
        "selections": [
          {
            "kind": "RequiredField",
            "field": (v1/*: any*/),
            "action": "THROW"
          }
        ],
        "storageKey": "recommendedJobAlerts(first:10)"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "UpdateResumeFormRecommendedJobAlertsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "RecommendedJobAlertConnection",
        "kind": "LinkedField",
        "name": "recommendedJobAlerts",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "RecommendedJobAlertEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "RecommendedJobAlert",
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
                    "alias": null,
                    "args": null,
                    "concreteType": "AlertFilters",
                    "kind": "LinkedField",
                    "name": "filters",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "searchTerm",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "location",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "minExperience",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "maxExperience",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "minSalary",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "maxSalary",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "jobType",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "workMode",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
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
          (v1/*: any*/),
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
        "storageKey": "recommendedJobAlerts(first:10)"
      },
      {
        "alias": null,
        "args": (v0/*: any*/),
        "filters": null,
        "handle": "connection",
        "key": "RecommendedJobAlertsFragment_recommendedJobAlerts",
        "kind": "LinkedHandle",
        "name": "recommendedJobAlerts"
      }
    ]
  },
  "params": {
    "id": "f0c6965a5f3c015f615bab3e1a969710",
    "metadata": {},
    "name": "UpdateResumeFormRecommendedJobAlertsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "8871760bd94bcaf6e17b677f818abbb1";

export default node;
