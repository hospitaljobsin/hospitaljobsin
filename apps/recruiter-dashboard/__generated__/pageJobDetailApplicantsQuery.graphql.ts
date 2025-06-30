/**
 * @generated SignedSource<<dd65222aa95f4bafe2d9949883d1e97c>>
 * @relayHash f17b20bfcc61a83a6cc79f62b2593234
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID f17b20bfcc61a83a6cc79f62b2593234

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobApplicantStatus = "APPLIED" | "INTERVIEWED" | "OFFERED" | "ONHOLD" | "SHORTLISTED" | "%future added value";
export type JobApplicantsSortBy = "CREATED_AT" | "OVERALL_SCORE" | "%future added value";
export type pageJobDetailApplicantsQuery$variables = {
  jobSlug: string;
  orgSlug: string;
  searchTerm?: string | null | undefined;
  sortBy: JobApplicantsSortBy;
  status?: JobApplicantStatus | null | undefined;
};
export type pageJobDetailApplicantsQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantsTabFragment">;
};
export type pageJobDetailApplicantsQuery = {
  response: pageJobDetailApplicantsQuery$data;
  variables: pageJobDetailApplicantsQuery$variables;
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
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "searchTerm"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "status"
},
v5 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v6 = {
  "kind": "Variable",
  "name": "slug",
  "variableName": "orgSlug"
},
v7 = {
  "kind": "Variable",
  "name": "sortBy",
  "variableName": "sortBy"
},
v8 = {
  "kind": "Variable",
  "name": "status",
  "variableName": "status"
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v11 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  (v5/*: any*/),
  (v7/*: any*/),
  (v8/*: any*/)
],
v12 = [
  (v10/*: any*/)
],
v13 = {
  "kind": "InlineFragment",
  "selections": (v12/*: any*/),
  "type": "Node",
  "abstractKey": "__isNode"
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageJobDetailApplicantsQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "jobSlug",
            "variableName": "jobSlug"
          },
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "ApplicantsTabFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/),
      (v4/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "pageJobDetailApplicantsQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          (v6/*: any*/)
        ],
        "concreteType": null,
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v9/*: any*/),
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
                  (v9/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v10/*: any*/),
                      {
                        "alias": null,
                        "args": (v11/*: any*/),
                        "concreteType": "JobApplicantConnection",
                        "kind": "LinkedField",
                        "name": "applicants",
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
                                  (v10/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Job",
                                    "kind": "LinkedField",
                                    "name": "job",
                                    "plural": false,
                                    "selections": (v12/*: any*/),
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Account",
                                    "kind": "LinkedField",
                                    "name": "account",
                                    "plural": false,
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
                                      (v10/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "slug",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "status",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "ProfileSnapshot",
                                    "kind": "LinkedField",
                                    "name": "profileSnapshot",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "headline",
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "overallScore",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": null,
                                    "kind": "LinkedField",
                                    "name": "analysis",
                                    "plural": false,
                                    "selections": [
                                      (v9/*: any*/),
                                      {
                                        "kind": "InlineFragment",
                                        "selections": [
                                          {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "overallSummary",
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "strengths",
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "riskFlags",
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "kind": "ScalarField",
                                            "name": "createdAt",
                                            "storageKey": null
                                          }
                                        ],
                                        "type": "JobApplicantAnalysis",
                                        "abstractKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  (v9/*: any*/)
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
                        "args": (v11/*: any*/),
                        "filters": [
                          "searchTerm",
                          "sortBy"
                        ],
                        "handle": "connection",
                        "key": "ApplicantListFragment_applicants",
                        "kind": "LinkedHandle",
                        "name": "applicants"
                      }
                    ],
                    "type": "Job",
                    "abstractKey": null
                  },
                  (v13/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Organization",
            "abstractKey": null
          },
          (v13/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "f17b20bfcc61a83a6cc79f62b2593234",
    "metadata": {},
    "name": "pageJobDetailApplicantsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "939d5239dc473b5dfb30724a6bd3dc99";

export default node;
