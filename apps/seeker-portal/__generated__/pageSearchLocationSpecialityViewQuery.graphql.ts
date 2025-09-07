/**
 * @generated SignedSource<<50692a44334c2a5a20f51b2787a3204d>>
 * @relayHash 1c26bf8fb0a3b31b9c62c2e3f0ec0d43
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 1c26bf8fb0a3b31b9c62c2e3f0ec0d43

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobSearchSortBy = "RELEVANCE" | "UPDATED_AT" | "%future added value";
export type JobTypeFilter = "CONTRACT" | "FULL_TIME" | "INTERNSHIP" | "LOCUM" | "PART_TIME" | "%future added value";
export type JobWorkModeFilter = "HYBRID" | "OFFICE" | "REMOTE" | "%future added value";
export type pageSearchLocationSpecialityViewQuery$variables = {
  jobType: ReadonlyArray<JobTypeFilter>;
  maxSalary?: number | null | undefined;
  minExperience?: number | null | undefined;
  minSalary?: number | null | undefined;
  proximityKm?: number | null | undefined;
  searchTerm?: string | null | undefined;
  sortBy: JobSearchSortBy;
  workMode: ReadonlyArray<JobWorkModeFilter>;
};
export type pageSearchLocationSpecialityViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"SearchViewLocationSpecialityClientComponentFragment">;
};
export type pageSearchLocationSpecialityViewQuery = {
  response: pageSearchLocationSpecialityViewQuery$data;
  variables: pageSearchLocationSpecialityViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobType"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxSalary"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minExperience"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minSalary"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "proximityKm"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "searchTerm"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "workMode"
},
v8 = {
  "kind": "Variable",
  "name": "jobType",
  "variableName": "jobType"
},
v9 = {
  "kind": "Variable",
  "name": "maxSalary",
  "variableName": "maxSalary"
},
v10 = {
  "kind": "Variable",
  "name": "minExperience",
  "variableName": "minExperience"
},
v11 = {
  "kind": "Variable",
  "name": "minSalary",
  "variableName": "minSalary"
},
v12 = {
  "kind": "Variable",
  "name": "proximityKm",
  "variableName": "proximityKm"
},
v13 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v14 = {
  "kind": "Variable",
  "name": "sortBy",
  "variableName": "sortBy"
},
v15 = {
  "kind": "Variable",
  "name": "workMode",
  "variableName": "workMode"
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v18 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 25
  },
  (v8/*: any*/),
  (v9/*: any*/),
  (v10/*: any*/),
  (v11/*: any*/),
  (v12/*: any*/),
  (v13/*: any*/),
  (v14/*: any*/),
  (v15/*: any*/)
],
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
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
      (v7/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageSearchLocationSpecialityViewQuery",
    "selections": [
      {
        "args": [
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "SearchViewLocationSpecialityClientComponentFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v5/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/),
      (v4/*: any*/),
      (v7/*: any*/),
      (v0/*: any*/),
      (v6/*: any*/)
    ],
    "kind": "Operation",
    "name": "pageSearchLocationSpecialityViewQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v16/*: any*/),
          {
            "kind": "TypeDiscriminator",
            "abstractKey": "__isViewerPayload"
          },
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "fullName",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "avatarUrl",
                "storageKey": null
              },
              (v17/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isComplete",
                    "storageKey": null
                  },
                  (v17/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v17/*: any*/)
            ],
            "type": "Node",
            "abstractKey": "__isNode"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v18/*: any*/),
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
          },
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
                  (v17/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isSaved",
                    "storageKey": null
                  },
                  (v19/*: any*/),
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
                      (v19/*: any*/),
                      (v17/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "verificationStatus",
                        "plural": false,
                        "selections": [
                          (v16/*: any*/),
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
                  (v16/*: any*/)
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
        "args": (v18/*: any*/),
        "filters": [
          "searchTerm",
          "proximityKm",
          "minExperience",
          "minExperience",
          "minSalary",
          "maxSalary",
          "workMode",
          "jobType",
          "sortBy",
          "location"
        ],
        "handle": "connection",
        "key": "JobListFragment_jobs",
        "kind": "LinkedHandle",
        "name": "jobs"
      }
    ]
  },
  "params": {
    "id": "1c26bf8fb0a3b31b9c62c2e3f0ec0d43",
    "metadata": {},
    "name": "pageSearchLocationSpecialityViewQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "e356c030af39c366280970c6f54a2a7f";

export default node;
