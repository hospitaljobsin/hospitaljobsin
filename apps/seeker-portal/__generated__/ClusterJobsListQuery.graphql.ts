/**
 * @generated SignedSource<<aca63c96504d5d2669a373766bb9ee70>>
 * @relayHash 2eb1ae44c2a4cf391e131c63a640385a
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 2eb1ae44c2a4cf391e131c63a640385a

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobSearchSortBy = "RELEVANCE" | "UPDATED_AT" | "%future added value";
export type JobTypeFilter = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type JobWorkModeFilter = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
export type BoundingBoxInput = {
  neLat: number;
  neLng: number;
  swLat: number;
  swLng: number;
};
export type ClusterJobsListQuery$variables = {
  bounds: BoundingBoxInput;
  jobType: ReadonlyArray<JobTypeFilter>;
  location?: string | null | undefined;
  maxSalary?: number | null | undefined;
  minExperience?: number | null | undefined;
  minSalary?: number | null | undefined;
  proximityKm?: number | null | undefined;
  searchTerm?: string | null | undefined;
  sortBy: JobSearchSortBy;
  workMode: ReadonlyArray<JobWorkModeFilter>;
};
export type ClusterJobsListQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ClusterJobsListInternalFragment">;
};
export type ClusterJobsListQuery = {
  response: ClusterJobsListQuery$data;
  variables: ClusterJobsListQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "bounds"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobType"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "location"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxSalary"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minExperience"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minSalary"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "proximityKm"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "searchTerm"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "workMode"
},
v10 = {
  "kind": "Variable",
  "name": "bounds",
  "variableName": "bounds"
},
v11 = {
  "kind": "Variable",
  "name": "jobType",
  "variableName": "jobType"
},
v12 = {
  "kind": "Variable",
  "name": "location",
  "variableName": "location"
},
v13 = {
  "kind": "Variable",
  "name": "maxSalary",
  "variableName": "maxSalary"
},
v14 = {
  "kind": "Variable",
  "name": "minExperience",
  "variableName": "minExperience"
},
v15 = {
  "kind": "Variable",
  "name": "minSalary",
  "variableName": "minSalary"
},
v16 = {
  "kind": "Variable",
  "name": "proximityKm",
  "variableName": "proximityKm"
},
v17 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v18 = {
  "kind": "Variable",
  "name": "sortBy",
  "variableName": "sortBy"
},
v19 = {
  "kind": "Variable",
  "name": "workMode",
  "variableName": "workMode"
},
v20 = [
  (v10/*: any*/),
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
  },
  (v11/*: any*/),
  (v12/*: any*/),
  (v13/*: any*/),
  (v14/*: any*/),
  (v15/*: any*/),
  (v16/*: any*/),
  (v17/*: any*/),
  (v18/*: any*/),
  (v19/*: any*/)
],
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ClusterJobsListQuery",
    "selections": [
      {
        "args": [
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "ClusterJobsListInternalFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v9/*: any*/),
      (v1/*: any*/),
      (v7/*: any*/),
      (v2/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v3/*: any*/),
      (v6/*: any*/),
      (v8/*: any*/)
    ],
    "kind": "Operation",
    "name": "ClusterJobsListQuery",
    "selections": [
      {
        "alias": null,
        "args": (v20/*: any*/),
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
                  (v21/*: any*/),
                  (v22/*: any*/),
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
                    "name": "location",
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
                    "name": "currency",
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
                    "name": "skills",
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
                      (v22/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "logoUrl",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "verificationStatus",
                        "plural": false,
                        "selections": [
                          (v23/*: any*/),
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
                          }
                        ],
                        "storageKey": null
                      },
                      (v21/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v23/*: any*/)
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "totalCount",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v20/*: any*/),
        "filters": [
          "bounds",
          "workMode",
          "jobType",
          "searchTerm",
          "location",
          "minExperience",
          "minSalary",
          "maxSalary",
          "proximityKm",
          "sortBy"
        ],
        "handle": "connection",
        "key": "ClusterJobsListFragment_jobs",
        "kind": "LinkedHandle",
        "name": "jobs"
      }
    ]
  },
  "params": {
    "id": "2eb1ae44c2a4cf391e131c63a640385a",
    "metadata": {},
    "name": "ClusterJobsListQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "53445308c1e50e0248808a4c4d1c8f64";

export default node;
