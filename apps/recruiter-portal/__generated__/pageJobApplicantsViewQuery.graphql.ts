/**
 * @generated SignedSource<<9215bcd0bbc128f5048f09ea341535ee>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type JobApplicantStatus = "APPLIED" | "INTERVIEWED" | "OFFERED" | "ONHOLD" | "SHORTLISTED" | "%future added value";
export type pageJobApplicantsViewQuery$variables = {
  jobSlug: string;
  searchTerm?: string | null | undefined;
  showStatus?: boolean | null | undefined;
  slug: string;
  status?: JobApplicantStatus | null | undefined;
};
export type pageJobApplicantsViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"JobApplicantsViewClientComponentFragment" | "pageJobApplicantsMetadataFragment">;
};
export type pageJobApplicantsViewQuery = {
  response: pageJobApplicantsViewQuery$data;
  variables: pageJobApplicantsViewQuery$variables;
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
  "name": "searchTerm"
},
v2 = {
  "defaultValue": true,
  "kind": "LocalArgument",
  "name": "showStatus"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "slug"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "status"
},
v5 = {
  "kind": "Variable",
  "name": "slug",
  "variableName": "slug"
},
v6 = [
  (v5/*: any*/)
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
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
  "name": "logoUrl",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMember",
  "storageKey": null
},
v12 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "jobSlug"
  }
],
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v14 = {
  "kind": "Variable",
  "name": "jobSlug",
  "variableName": "jobSlug"
},
v15 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v16 = {
  "kind": "Variable",
  "name": "status",
  "variableName": "status"
},
v17 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  (v15/*: any*/),
  (v16/*: any*/)
],
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v19 = {
  "kind": "InlineFragment",
  "selections": [
    (v18/*: any*/)
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
    "name": "pageJobApplicantsViewQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pageJobApplicantsMetadataFragment",
        "selections": [
          {
            "alias": null,
            "args": (v6/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              (v7/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  {
                    "alias": null,
                    "args": (v12/*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "job",
                    "plural": false,
                    "selections": [
                      (v7/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v13/*: any*/)
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
        "args": [
          (v14/*: any*/),
          (v5/*: any*/)
        ],
        "argumentDefinitions": [
          (v0/*: any*/),
          (v3/*: any*/)
        ]
      },
      {
        "args": [
          (v14/*: any*/),
          (v15/*: any*/),
          {
            "kind": "Variable",
            "name": "showStatus",
            "variableName": "showStatus"
          },
          (v5/*: any*/),
          (v16/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "JobApplicantsViewClientComponentFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v3/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/),
      (v4/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "pageJobApplicantsViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v6/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v7/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": null,
                "kind": "LinkedField",
                "name": "job",
                "plural": false,
                "selections": [
                  (v7/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v13/*: any*/),
                      {
                        "alias": null,
                        "args": (v17/*: any*/),
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
                                  (v18/*: any*/),
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
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "email",
                                        "storageKey": null
                                      },
                                      (v18/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v7/*: any*/)
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
                        "args": (v17/*: any*/),
                        "filters": [
                          "status",
                          "searchTerm"
                        ],
                        "handle": "connection",
                        "key": "ApplicantListFragment_applicants",
                        "kind": "LinkedHandle",
                        "name": "applicants"
                      },
                      (v18/*: any*/)
                    ],
                    "type": "Job",
                    "abstractKey": null
                  },
                  (v19/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Organization",
            "abstractKey": null
          },
          (v19/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1d393bf17a72750dc6d237efd5f45720",
    "id": null,
    "metadata": {},
    "name": "pageJobApplicantsViewQuery",
    "operationKind": "query",
    "text": "query pageJobApplicantsViewQuery(\n  $slug: String!\n  $jobSlug: String!\n  $searchTerm: String\n  $status: JobApplicantStatus\n  $showStatus: Boolean = true\n) {\n  ...pageJobApplicantsMetadataFragment_4lHzkn\n  ...JobApplicantsViewClientComponentFragment_2tIqbU\n}\n\nfragment ApplicantFragment_KpWpU on JobApplicant {\n  slug\n  status @include(if: $showStatus)\n  account {\n    fullName\n    avatarUrl\n    email\n    id\n  }\n}\n\nfragment ApplicantListFragment_4dh3bL on Job {\n  applicants(first: 10, searchTerm: $searchTerm, status: $status) {\n    edges {\n      node {\n        id\n        ...ApplicantFragment_KpWpU\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n  id\n}\n\nfragment ApplicantsTabFragment_2tIqbU on Query {\n  organization(slug: $slug) {\n    __typename\n    ... on Organization {\n      job(slug: $jobSlug) {\n        __typename\n        ... on Job {\n          ...ApplicantListFragment_4dh3bL\n        }\n        ... on Node {\n          __isNode: __typename\n          id\n        }\n      }\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment JobApplicantsViewClientComponentFragment_2tIqbU on Query {\n  ...ApplicantsTabFragment_2tIqbU\n}\n\nfragment pageJobApplicantsMetadataFragment_4lHzkn on Query {\n  organization(slug: $slug) {\n    __typename\n    ... on Organization {\n      name\n      description\n      logoUrl\n      isMember\n      job(slug: $jobSlug) {\n        __typename\n        ... on Job {\n          title\n        }\n        ... on Node {\n          __isNode: __typename\n          id\n        }\n      }\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "374a5dd62affffb41a19259c803ceea6";

export default node;
