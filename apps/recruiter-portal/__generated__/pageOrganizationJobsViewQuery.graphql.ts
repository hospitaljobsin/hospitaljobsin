/**
 * @generated SignedSource<<6cbb343b57802e095539287a8502da00>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageOrganizationJobsViewQuery$variables = {
  searchTerm?: string | null | undefined;
  slug: string;
};
export type pageOrganizationJobsViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationJobsViewClientComponentFragment" | "pageOrganizationJobsMetadataFragment">;
};
export type pageOrganizationJobsViewQuery = {
  response: pageOrganizationJobsViewQuery$data;
  variables: pageOrganizationJobsViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "searchTerm"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "slug"
},
v2 = {
  "kind": "Variable",
  "name": "slug",
  "variableName": "slug"
},
v3 = [
  (v2/*: any*/)
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "logoUrl",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMember",
  "storageKey": null
},
v9 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v10 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  (v9/*: any*/)
],
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageOrganizationJobsViewQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pageOrganizationJobsMetadataFragment",
        "selections": [
          {
            "alias": null,
            "args": (v3/*: any*/),
            "concreteType": null,
            "kind": "LinkedField",
            "name": "organization",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/)
                ],
                "type": "Organization",
                "abstractKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "args": (v3/*: any*/),
        "argumentDefinitions": [
          (v1/*: any*/)
        ]
      },
      {
        "args": [
          (v9/*: any*/),
          (v2/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "OrganizationJobsViewClientComponentFragment"
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
    "name": "pageOrganizationJobsViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              {
                "alias": null,
                "args": (v10/*: any*/),
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
                          (v11/*: any*/),
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
                            "name": "title",
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
                            "name": "viewCount",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "createdAt",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "JobApplicantCount",
                            "kind": "LinkedField",
                            "name": "applicantCount",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "applied",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "shortlisted",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "interviewed",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "onHold",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "offered",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "vacancies",
                            "storageKey": null
                          },
                          (v4/*: any*/)
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
                  "searchTerm"
                ],
                "handle": "connection",
                "key": "OrganizationJobsListInternalFragment_jobs",
                "kind": "LinkedHandle",
                "name": "jobs"
              },
              (v11/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isAdmin",
                "storageKey": null
              }
            ],
            "type": "Organization",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v11/*: any*/)
            ],
            "type": "Node",
            "abstractKey": "__isNode"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "0a5f4e4e86fa3419cfe60444699265f3",
    "id": null,
    "metadata": {},
    "name": "pageOrganizationJobsViewQuery",
    "operationKind": "query",
    "text": "query pageOrganizationJobsViewQuery($slug:String!,$searchTerm:String){...pageOrganizationJobsMetadataFragment_20J5Pl,...OrganizationJobsViewClientComponentFragment_113nns}fragment JobFragment on Job{slug,title,skills,viewCount,createdAt,applicantCount{applied,shortlisted,interviewed,onHold,offered},vacancies}fragment OrganizationJobsControllerFragment_20J5Pl on Query{organization(slug:$slug){__typename,...on Organization{isAdmin},...on Node{__isNode:__typename,id}}}fragment OrganizationJobsListFragment_113nns on Query{organization(slug:$slug){__typename,...on Organization{...OrganizationJobsListInternalFragment_1CW4ID},...on Node{__isNode:__typename,id}}}fragment OrganizationJobsListInternalFragment_1CW4ID on Organization{jobs(first:10,searchTerm:$searchTerm){edges{node{id,...JobFragment,__typename},cursor},pageInfo{hasNextPage,endCursor}},id}fragment OrganizationJobsTabFragment_113nns on Query{...OrganizationJobsListFragment_113nns,...OrganizationJobsControllerFragment_20J5Pl}fragment OrganizationJobsViewClientComponentFragment_113nns on Query{...OrganizationJobsTabFragment_113nns}fragment pageOrganizationJobsMetadataFragment_20J5Pl on Query{organization(slug:$slug){__typename,...on Organization{name,description,logoUrl,isMember},...on Node{__isNode:__typename,id}}}"
  }
};
})();

(node as any).hash = "1a9af53e94a7db46db6387356f39b661";

export default node;
