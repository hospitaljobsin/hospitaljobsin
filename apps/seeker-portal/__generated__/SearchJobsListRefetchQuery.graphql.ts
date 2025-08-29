/**
 * @generated SignedSource<<66f5be23d332b545596919a6aef17dbb>>
 * @relayHash 3e0b3b9165d0ff47d898c0720e017427
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 3e0b3b9165d0ff47d898c0720e017427

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobTypeFilter = "ANY" | "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type JobWorkModeFilter = "ANY" | "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
export type CoordinatesInput = {
  latitude: number;
  longitude: number;
};
export type SearchJobsListRefetchQuery$variables = {
  coordinates?: CoordinatesInput | null | undefined;
  count?: number | null | undefined;
  cursor?: string | null | undefined;
  jobType?: JobTypeFilter | null | undefined;
  maxSalary?: number | null | undefined;
  minExperience?: number | null | undefined;
  minSalary?: number | null | undefined;
  proximityKm?: number | null | undefined;
  searchTerm?: string | null | undefined;
  workMode?: JobWorkModeFilter | null | undefined;
};
export type SearchJobsListRefetchQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"SearchJobsListInternalFragment">;
};
export type SearchJobsListRefetchQuery = {
  response: SearchJobsListRefetchQuery$data;
  variables: SearchJobsListRefetchQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "coordinates"
  },
  {
    "defaultValue": 5,
    "kind": "LocalArgument",
    "name": "count"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "cursor"
  },
  {
    "defaultValue": "ANY",
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
    "defaultValue": "ANY",
    "kind": "LocalArgument",
    "name": "workMode"
  }
],
v1 = {
  "kind": "Variable",
  "name": "coordinates",
  "variableName": "coordinates"
},
v2 = {
  "kind": "Variable",
  "name": "jobType",
  "variableName": "jobType"
},
v3 = {
  "kind": "Variable",
  "name": "maxSalary",
  "variableName": "maxSalary"
},
v4 = {
  "kind": "Variable",
  "name": "minExperience",
  "variableName": "minExperience"
},
v5 = {
  "kind": "Variable",
  "name": "minSalary",
  "variableName": "minSalary"
},
v6 = {
  "kind": "Variable",
  "name": "proximityKm",
  "variableName": "proximityKm"
},
v7 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v8 = {
  "kind": "Variable",
  "name": "workMode",
  "variableName": "workMode"
},
v9 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  (v1/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  (v2/*: any*/),
  (v3/*: any*/),
  (v4/*: any*/),
  (v5/*: any*/),
  (v6/*: any*/),
  (v7/*: any*/),
  (v8/*: any*/)
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SearchJobsListRefetchQuery",
    "selections": [
      {
        "args": [
          (v1/*: any*/),
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          {
            "kind": "Variable",
            "name": "cursor",
            "variableName": "cursor"
          },
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "SearchJobsListInternalFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SearchJobsListRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v9/*: any*/),
        "concreteType": "JobConnection",
        "kind": "LinkedField",
        "name": "jobs",
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
                  (v10/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isSaved",
                    "storageKey": null
                  },
                  (v11/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "title",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "description",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Organization",
                    "kind": "LinkedField",
                    "name": "organization",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "name",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "logoUrl",
                        "storageKey": null
                      },
                      (v11/*: any*/),
                      (v10/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "verificationStatus",
                        "plural": false,
                        "selections": [
                          (v12/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "verifiedAt",
                                "storageKey": null
                              }
                            ],
                            "type": "Verified",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "rejectedAt",
                                "storageKey": null
                              }
                            ],
                            "type": "Rejected",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "requestedAt",
                                "storageKey": null
                              }
                            ],
                            "type": "Pending",
                            "abstractKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "type",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "workMode",
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
                    "name": "skills",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "currency",
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
                    "name": "createdAt",
                    "storageKey": null
                  },
                  (v12/*: any*/)
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
      },
      {
        "alias": null,
        "args": (v9/*: any*/),
        "filters": [
          "searchTerm",
          "coordinates",
          "proximityKm",
          "minExperience",
          "minExperience",
          "minSalary",
          "maxSalary",
          "workMode",
          "jobType"
        ],
        "handle": "connection",
        "key": "JobListFragment_jobs",
        "kind": "LinkedHandle",
        "name": "jobs"
      }
    ]
  },
  "params": {
    "id": "3e0b3b9165d0ff47d898c0720e017427",
    "metadata": {},
    "name": "SearchJobsListRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "38d2a22c84cd334658b3a731ae9741f7";

export default node;
