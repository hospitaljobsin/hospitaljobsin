/**
 * @generated SignedSource<<9f4acf9f4dc933d0fde6e2ad82f3d03b>>
 * @relayHash d7cd5d5c02fe50ca7300a211284343b8
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID d7cd5d5c02fe50ca7300a211284343b8

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobApplicantStatus = "APPLIED" | "INTERVIEWED" | "OFFERED" | "ONHOLD" | "SHORTLISTED" | "%future added value";
export type pageJobDetailApplicantsQuery$variables = {
  jobSlug: string;
  orgSlug: string;
  searchTerm?: string | null | undefined;
  showStatus?: boolean | null | undefined;
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
  "defaultValue": true,
  "kind": "LocalArgument",
  "name": "showStatus"
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
  "name": "status",
  "variableName": "status"
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v10 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  (v5/*: any*/),
  (v7/*: any*/)
],
v11 = {
  "kind": "InlineFragment",
  "selections": [
    (v9/*: any*/)
  ],
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
          {
            "kind": "Variable",
            "name": "showStatus",
            "variableName": "showStatus"
          },
          (v6/*: any*/),
          (v7/*: any*/)
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
          (v8/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
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
                  (v8/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v9/*: any*/),
                      {
                        "alias": null,
                        "args": (v10/*: any*/),
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
                                  (v9/*: any*/),
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
                                        "name": "email",
                                        "storageKey": null
                                      },
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
                                      (v9/*: any*/)
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
                                    "condition": "showStatus",
                                    "kind": "Condition",
                                    "passingValue": true,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "status",
                                        "storageKey": null
                                      }
                                    ]
                                  },
                                  (v8/*: any*/)
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
                        "args": (v10/*: any*/),
                        "filters": [
                          "status",
                          "searchTerm"
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
                  (v11/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Organization",
            "abstractKey": null
          },
          (v11/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "d7cd5d5c02fe50ca7300a211284343b8",
    "metadata": {},
    "name": "pageJobDetailApplicantsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "16d73aaa5f98917584c436163ed16021";

export default node;
