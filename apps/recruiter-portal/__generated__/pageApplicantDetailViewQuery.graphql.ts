/**
 * @generated SignedSource<<89567f4bfd8b83b9c053da90260fdfc6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageApplicantDetailViewQuery$variables = {
  applicantSlug: string;
  jobSlug: string;
  slug: string;
};
export type pageApplicantDetailViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantDetailViewClientComponentFragment" | "pageApplicantDetailMetadataFragment">;
};
export type pageApplicantDetailViewQuery = {
  response: pageApplicantDetailViewQuery$data;
  variables: pageApplicantDetailViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "applicantSlug"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "jobSlug"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "slug"
},
v3 = [
  (v0/*: any*/),
  (v1/*: any*/),
  (v2/*: any*/)
],
v4 = {
  "kind": "Variable",
  "name": "slug",
  "variableName": "slug"
},
v5 = [
  (v4/*: any*/)
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMember",
  "storageKey": null
},
v8 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "jobSlug"
  }
],
v9 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "applicantSlug"
  }
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": null
},
v12 = [
  {
    "kind": "Variable",
    "name": "applicantSlug",
    "variableName": "applicantSlug"
  },
  {
    "kind": "Variable",
    "name": "jobSlug",
    "variableName": "jobSlug"
  },
  (v4/*: any*/)
],
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v14 = {
  "kind": "InlineFragment",
  "selections": [
    (v13/*: any*/)
  ],
  "type": "Node",
  "abstractKey": "__isNode"
};
return {
  "fragment": {
    "argumentDefinitions": (v3/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "pageApplicantDetailViewQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pageApplicantDetailMetadataFragment",
        "selections": [
          {
            "alias": null,
            "args": (v5/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              (v6/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v7/*: any*/),
                  {
                    "alias": null,
                    "args": (v8/*: any*/),
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "job",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          {
                            "alias": null,
                            "args": (v9/*: any*/),
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "jobApplicant",
                            "plural": false,
                            "selections": [
                              (v6/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Account",
                                    "kind": "LinkedField",
                                    "name": "account",
                                    "plural": false,
                                    "selections": [
                                      (v10/*: any*/),
                                      (v11/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "type": "JobApplicant",
                                "abstractKey": null
                              }
                            ],
                            "storageKey": null
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
        "args": (v12/*: any*/),
        "argumentDefinitions": (v3/*: any*/)
      },
      {
        "args": (v12/*: any*/),
        "kind": "FragmentSpread",
        "name": "ApplicantDetailViewClientComponentFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "pageApplicantDetailViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v7/*: any*/),
              {
                "alias": null,
                "args": (v8/*: any*/),
                "concreteType": null,
                "kind": "LinkedField",
                "name": "job",
                "plural": false,
                "selections": [
                  (v6/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      {
                        "alias": null,
                        "args": (v9/*: any*/),
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "jobApplicant",
                        "plural": false,
                        "selections": [
                          (v6/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Account",
                                "kind": "LinkedField",
                                "name": "account",
                                "plural": false,
                                "selections": [
                                  (v10/*: any*/),
                                  (v11/*: any*/),
                                  (v13/*: any*/),
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
                                    "concreteType": null,
                                    "kind": "LinkedField",
                                    "name": "profile",
                                    "plural": false,
                                    "selections": [
                                      (v6/*: any*/),
                                      {
                                        "kind": "InlineFragment",
                                        "selections": [
                                          {
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
                                                "name": "city",
                                                "storageKey": null
                                              },
                                              {
                                                "alias": null,
                                                "args": null,
                                                "kind": "ScalarField",
                                                "name": "state",
                                                "storageKey": null
                                              }
                                            ],
                                            "storageKey": null
                                          }
                                        ],
                                        "type": "Profile",
                                        "abstractKey": null
                                      },
                                      (v14/*: any*/)
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
                                "name": "status",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "resumeUrl",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "ApplicantField",
                                "kind": "LinkedField",
                                "name": "applicantFields",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "fieldName",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "fieldValue",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "type": "JobApplicant",
                            "abstractKey": null
                          },
                          (v14/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "Job",
                    "abstractKey": null
                  },
                  (v14/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Organization",
            "abstractKey": null
          },
          (v14/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ec17c96e14f664919146b32f6ce357f0",
    "id": null,
    "metadata": {},
    "name": "pageApplicantDetailViewQuery",
    "operationKind": "query",
    "text": "query pageApplicantDetailViewQuery(\n  $slug: String!\n  $jobSlug: String!\n  $applicantSlug: String!\n) {\n  ...pageApplicantDetailMetadataFragment_VJkEr\n  ...ApplicantDetailViewClientComponentFragment_VJkEr\n}\n\nfragment ApplicantDetailViewClientComponentFragment_VJkEr on Query {\n  ...ApplicantDetailViewFragment_VJkEr\n}\n\nfragment ApplicantDetailViewFragment_VJkEr on Query {\n  organization(slug: $slug) {\n    __typename\n    ... on Organization {\n      job(slug: $jobSlug) {\n        __typename\n        ... on Job {\n          jobApplicant(slug: $applicantSlug) {\n            __typename\n            ... on JobApplicant {\n              ...ApplicantDetailsFragment\n            }\n            ... on Node {\n              __isNode: __typename\n              id\n            }\n          }\n        }\n        ... on Node {\n          __isNode: __typename\n          id\n        }\n      }\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment ApplicantDetailsFragment on JobApplicant {\n  status\n  resumeUrl\n  applicantFields {\n    fieldName\n    fieldValue\n  }\n  account {\n    fullName\n    avatarUrl\n    email\n    profile {\n      __typename\n      ... on Profile {\n        address {\n          city\n          state\n        }\n      }\n      ... on ProfileNotFoundError {\n        __typename\n      }\n      ... on Node {\n        __isNode: __typename\n        id\n      }\n    }\n    id\n  }\n}\n\nfragment pageApplicantDetailMetadataFragment_VJkEr on Query {\n  organization(slug: $slug) {\n    __typename\n    ... on Organization {\n      isMember\n      job(slug: $jobSlug) {\n        __typename\n        ... on Job {\n          __typename\n          jobApplicant(slug: $applicantSlug) {\n            __typename\n            ... on JobApplicant {\n              account {\n                fullName\n                avatarUrl\n                id\n              }\n            }\n            ... on Node {\n              __isNode: __typename\n              id\n            }\n          }\n        }\n        ... on Node {\n          __isNode: __typename\n          id\n        }\n      }\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "35415241721be871bfbe55145bc2514e";

export default node;
