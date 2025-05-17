/**
 * @generated SignedSource<<f2e4aee4ae692556bcf8c5943c051fd8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageOrganizationInvitesViewQuery$variables = {
  searchTerm?: string | null | undefined;
  slug: string;
};
export type pageOrganizationInvitesViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationInvitesViewClientComponentFragment" | "pageOrganizationInvitesMetadataFragment">;
};
export type pageOrganizationInvitesViewQuery = {
  response: pageOrganizationInvitesViewQuery$data;
  variables: pageOrganizationInvitesViewQuery$variables;
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
  "name": "isAdmin",
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
    "name": "pageOrganizationInvitesViewQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pageOrganizationInvitesMetadataFragment",
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
        "name": "OrganizationInvitesViewClientComponentFragment"
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
    "name": "pageOrganizationInvitesViewQuery",
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
                "concreteType": "InviteConnection",
                "kind": "LinkedField",
                "name": "invites",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "OrganizationInviteEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "OrganizationInvite",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v11/*: any*/),
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
                            "name": "status",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "expiresAt",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Account",
                            "kind": "LinkedField",
                            "name": "createdBy",
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
                              (v11/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "createdAt",
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
                  },
                  {
                    "kind": "ClientExtension",
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "__id",
                        "storageKey": null
                      }
                    ]
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
                "key": "OrganizationInvitesListInternalFragment_invites",
                "kind": "LinkedHandle",
                "name": "invites"
              },
              (v11/*: any*/)
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
    "cacheID": "2e02045d336ed66912e65e7e4a109b5d",
    "id": null,
    "metadata": {},
    "name": "pageOrganizationInvitesViewQuery",
    "operationKind": "query",
    "text": "query pageOrganizationInvitesViewQuery(\n  $slug: String!\n  $searchTerm: String\n) {\n  ...pageOrganizationInvitesMetadataFragment_20J5Pl\n  ...OrganizationInvitesViewClientComponentFragment_113nns\n}\n\nfragment DeleteInviteModalFragment on OrganizationInvite {\n  id\n  email\n}\n\nfragment DeleteInviteModalOrganizationFragment on Organization {\n  id\n}\n\nfragment InviteFragment on OrganizationInvite {\n  email\n  status\n  expiresAt\n  createdBy {\n    fullName\n    avatarUrl\n    id\n  }\n  createdAt\n  ...DeleteInviteModalFragment\n}\n\nfragment InviteMemberModalFragment on Organization {\n  id\n}\n\nfragment InviteOrganizationFragment on Organization {\n  ...DeleteInviteModalOrganizationFragment\n}\n\nfragment OrganizationInvitesControllerFragment_20J5Pl on Query {\n  organization(slug: $slug) {\n    __typename\n    ... on Organization {\n      ...InviteMemberModalFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment OrganizationInvitesListFragment_113nns on Query {\n  organization(slug: $slug) {\n    __typename\n    ... on Organization {\n      ...OrganizationInvitesListInternalFragment_1CW4ID\n      ...InviteOrganizationFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment OrganizationInvitesListInternalFragment_1CW4ID on Organization {\n  invites(first: 10, searchTerm: $searchTerm) {\n    edges {\n      node {\n        id\n        ...InviteFragment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n  id\n}\n\nfragment OrganizationInvitesViewClientComponentFragment_113nns on Query {\n  ...OrganizationInvitesViewFragment_113nns\n}\n\nfragment OrganizationInvitesViewFragment_113nns on Query {\n  ...OrganizationInvitesListFragment_113nns\n  ...OrganizationInvitesControllerFragment_20J5Pl\n}\n\nfragment pageOrganizationInvitesMetadataFragment_20J5Pl on Query {\n  organization(slug: $slug) {\n    __typename\n    ... on Organization {\n      name\n      description\n      logoUrl\n      isAdmin\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "12488d9edd14a63747c2adb19cdc94fa";

export default node;
