/**
 * @generated SignedSource<<7a3127cc121226c550148ff29299d35e>>
 * @relayHash 7b7d21964f07a957ff30c75292f995a7
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 7b7d21964f07a957ff30c75292f995a7

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageJobDetailViewQuery$variables = {
  jobSlug: string;
  slug: string;
};
export type pageJobDetailViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"pageJobDetailServerFragment">;
};
export type pageJobDetailViewQuery = {
  response: pageJobDetailViewQuery$data;
  variables: pageJobDetailViewQuery$variables;
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
  "name": "slug"
},
v2 = [
  (v0/*: any*/),
  (v1/*: any*/)
],
v3 = {
  "kind": "Variable",
  "name": "slug",
  "variableName": "slug"
},
v4 = [
  (v3/*: any*/)
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v6 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "jobSlug"
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "descriptionHtml",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "workMode",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "location",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "skills",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "currency",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "minSalary",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxSalary",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "minExperience",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxExperience",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "vacancies",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isSalaryNegotiable",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "descriptionCleaned",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "logoUrl",
  "storageKey": null
},
v26 = {
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
v27 = {
  "fragment": (v26/*: any*/),
  "kind": "AliasedInlineFragmentSpread",
  "name": "verified"
},
v28 = {
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
v29 = {
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
},
v30 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "message",
      "storageKey": null
    }
  ],
  "type": "NotRequested",
  "abstractKey": null
},
v31 = [
  {
    "kind": "Variable",
    "name": "jobSlug",
    "variableName": "jobSlug"
  },
  (v3/*: any*/)
],
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v34 = {
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
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bannerUrl",
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "website",
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isVisible",
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "expiresAt",
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "concreteType": "Address",
  "kind": "LinkedField",
  "name": "address",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "addressLocality",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "addressRegion",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "country",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "postalCode",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "streetAddress",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "applicantLocations",
  "storageKey": null
},
v41 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 4
  }
],
v42 = {
  "kind": "InlineFragment",
  "selections": [
    (v32/*: any*/)
  ],
  "type": "Node",
  "abstractKey": "__isNode"
};
return {
  "fragment": {
    "argumentDefinitions": (v2/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "pageJobDetailViewQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pageJobDetailServerFragment",
        "selections": [
          {
            "kind": "InlineDataFragmentSpread",
            "name": "JobDetailViewFragment",
            "selections": [
              {
                "kind": "InlineDataFragmentSpread",
                "name": "JobDetailsFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": (v4/*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "organization",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          {
                            "alias": null,
                            "args": (v6/*: any*/),
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "job",
                            "plural": false,
                            "selections": [
                              (v5/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  {
                                    "kind": "InlineDataFragmentSpread",
                                    "name": "JobDetailsInternalFragment",
                                    "selections": [
                                      (v7/*: any*/),
                                      (v8/*: any*/),
                                      (v9/*: any*/),
                                      (v10/*: any*/),
                                      (v11/*: any*/),
                                      (v12/*: any*/),
                                      (v13/*: any*/),
                                      (v14/*: any*/),
                                      (v15/*: any*/),
                                      (v16/*: any*/),
                                      (v17/*: any*/),
                                      (v18/*: any*/),
                                      (v19/*: any*/),
                                      (v20/*: any*/),
                                      (v21/*: any*/),
                                      (v22/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "Organization",
                                        "kind": "LinkedField",
                                        "name": "organization",
                                        "plural": false,
                                        "selections": [
                                          (v8/*: any*/),
                                          (v23/*: any*/),
                                          (v24/*: any*/),
                                          (v25/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": null,
                                            "kind": "LinkedField",
                                            "name": "verificationStatus",
                                            "plural": false,
                                            "selections": [
                                              (v5/*: any*/),
                                              (v27/*: any*/),
                                              (v28/*: any*/),
                                              (v29/*: any*/),
                                              (v30/*: any*/)
                                            ],
                                            "storageKey": null
                                          }
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "args": null,
                                    "argumentDefinitions": []
                                  }
                                ],
                                "type": "Job",
                                "abstractKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "type": "Organization",
                        "abstractKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "args": (v31/*: any*/),
                "argumentDefinitions": (v2/*: any*/)
              },
              {
                "alias": null,
                "args": (v4/*: any*/),
                "concreteType": null,
                "kind": "LinkedField",
                "name": "organization",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      {
                        "alias": null,
                        "args": (v6/*: any*/),
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "job",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v32/*: any*/),
                              {
                                "kind": "InlineDataFragmentSpread",
                                "name": "RelatedJobsListFragment",
                                "selections": [
                                  {
                                    "alias": "relatedJobs",
                                    "args": null,
                                    "concreteType": "JobConnection",
                                    "kind": "LinkedField",
                                    "name": "__RelatedJobsListFragment_relatedJobs_connection",
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
                                              (v32/*: any*/),
                                              {
                                                "kind": "InlineDataFragmentSpread",
                                                "name": "AuxiliaryJobFragment",
                                                "selections": [
                                                  {
                                                    "args": null,
                                                    "kind": "FragmentSpread",
                                                    "name": "JobControlsFragment"
                                                  },
                                                  (v8/*: any*/),
                                                  (v7/*: any*/),
                                                  (v11/*: any*/),
                                                  (v12/*: any*/),
                                                  (v13/*: any*/),
                                                  (v14/*: any*/),
                                                  (v15/*: any*/),
                                                  (v16/*: any*/),
                                                  (v17/*: any*/),
                                                  (v18/*: any*/),
                                                  (v19/*: any*/),
                                                  {
                                                    "alias": null,
                                                    "args": null,
                                                    "concreteType": "Organization",
                                                    "kind": "LinkedField",
                                                    "name": "organization",
                                                    "plural": false,
                                                    "selections": [
                                                      {
                                                        "condition": "showOrganization",
                                                        "kind": "Condition",
                                                        "passingValue": true,
                                                        "selections": [
                                                          (v23/*: any*/),
                                                          (v25/*: any*/)
                                                        ]
                                                      },
                                                      (v8/*: any*/),
                                                      {
                                                        "alias": null,
                                                        "args": null,
                                                        "concreteType": null,
                                                        "kind": "LinkedField",
                                                        "name": "verificationStatus",
                                                        "plural": false,
                                                        "selections": [
                                                          (v5/*: any*/),
                                                          (v27/*: any*/)
                                                        ],
                                                        "storageKey": null
                                                      }
                                                    ],
                                                    "storageKey": null
                                                  }
                                                ],
                                                "args": null,
                                                "argumentDefinitions": [
                                                  {
                                                    "defaultValue": true,
                                                    "kind": "LocalArgument",
                                                    "name": "showOrganization"
                                                  }
                                                ]
                                              },
                                              (v5/*: any*/)
                                            ],
                                            "storageKey": null
                                          },
                                          (v33/*: any*/)
                                        ],
                                        "storageKey": null
                                      },
                                      (v34/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v32/*: any*/)
                                ],
                                "args": null,
                                "argumentDefinitions": [
                                  {
                                    "defaultValue": 4,
                                    "kind": "LocalArgument",
                                    "name": "count"
                                  },
                                  {
                                    "defaultValue": null,
                                    "kind": "LocalArgument",
                                    "name": "cursor"
                                  }
                                ]
                              }
                            ],
                            "type": "Job",
                            "abstractKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "Organization",
                    "abstractKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "args": (v31/*: any*/),
            "argumentDefinitions": (v2/*: any*/)
          },
          {
            "alias": null,
            "args": (v4/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              (v5/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v35/*: any*/),
                  (v25/*: any*/),
                  (v23/*: any*/),
                  (v13/*: any*/),
                  (v36/*: any*/),
                  (v9/*: any*/),
                  {
                    "alias": null,
                    "args": (v6/*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "job",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v7/*: any*/),
                          (v24/*: any*/),
                          (v10/*: any*/),
                          (v37/*: any*/),
                          (v20/*: any*/),
                          (v12/*: any*/),
                          (v11/*: any*/),
                          (v38/*: any*/),
                          (v13/*: any*/),
                          (v39/*: any*/),
                          (v40/*: any*/),
                          (v16/*: any*/),
                          (v17/*: any*/),
                          (v8/*: any*/)
                        ],
                        "type": "Job",
                        "abstractKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "type": "Organization",
                "abstractKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "args": (v31/*: any*/),
        "argumentDefinitions": (v2/*: any*/)
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
    "name": "pageJobDetailViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": (v6/*: any*/),
                "concreteType": null,
                "kind": "LinkedField",
                "name": "job",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v14/*: any*/),
                      (v15/*: any*/),
                      (v16/*: any*/),
                      (v17/*: any*/),
                      (v18/*: any*/),
                      (v19/*: any*/),
                      (v20/*: any*/),
                      (v21/*: any*/),
                      (v22/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Organization",
                        "kind": "LinkedField",
                        "name": "organization",
                        "plural": false,
                        "selections": [
                          (v8/*: any*/),
                          (v23/*: any*/),
                          (v24/*: any*/),
                          (v25/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "verificationStatus",
                            "plural": false,
                            "selections": [
                              (v5/*: any*/),
                              (v26/*: any*/),
                              (v28/*: any*/),
                              (v29/*: any*/),
                              (v30/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v32/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v32/*: any*/),
                      {
                        "alias": null,
                        "args": (v41/*: any*/),
                        "concreteType": "JobConnection",
                        "kind": "LinkedField",
                        "name": "relatedJobs",
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
                                  (v32/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "isSaved",
                                    "storageKey": null
                                  },
                                  (v8/*: any*/),
                                  (v7/*: any*/),
                                  (v9/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Organization",
                                    "kind": "LinkedField",
                                    "name": "organization",
                                    "plural": false,
                                    "selections": [
                                      (v23/*: any*/),
                                      (v25/*: any*/),
                                      (v8/*: any*/),
                                      (v32/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": null,
                                        "kind": "LinkedField",
                                        "name": "verificationStatus",
                                        "plural": false,
                                        "selections": [
                                          (v5/*: any*/),
                                          (v26/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  (v11/*: any*/),
                                  (v12/*: any*/),
                                  (v13/*: any*/),
                                  (v14/*: any*/),
                                  (v15/*: any*/),
                                  (v16/*: any*/),
                                  (v17/*: any*/),
                                  (v18/*: any*/),
                                  (v19/*: any*/),
                                  (v5/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v33/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v34/*: any*/)
                        ],
                        "storageKey": "relatedJobs(first:4)"
                      },
                      {
                        "alias": null,
                        "args": (v41/*: any*/),
                        "filters": null,
                        "handle": "connection",
                        "key": "RelatedJobsListFragment_relatedJobs",
                        "kind": "LinkedHandle",
                        "name": "relatedJobs"
                      },
                      (v24/*: any*/),
                      (v37/*: any*/),
                      (v38/*: any*/),
                      (v39/*: any*/),
                      (v40/*: any*/)
                    ],
                    "type": "Job",
                    "abstractKey": null
                  },
                  (v42/*: any*/)
                ],
                "storageKey": null
              },
              (v35/*: any*/),
              (v25/*: any*/),
              (v23/*: any*/),
              (v13/*: any*/),
              (v36/*: any*/),
              (v9/*: any*/)
            ],
            "type": "Organization",
            "abstractKey": null
          },
          (v42/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "7b7d21964f07a957ff30c75292f995a7",
    "metadata": {},
    "name": "pageJobDetailViewQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "33d87b912a586b9ec9b81f7ebbda1fad";

export default node;
