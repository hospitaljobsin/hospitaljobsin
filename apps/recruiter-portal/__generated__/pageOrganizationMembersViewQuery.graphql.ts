/**
 * @generated SignedSource<<75cf19ac6b6e5b60124092aa0f1bf585>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageOrganizationMembersViewQuery$variables = {
  searchTerm?: string | null | undefined;
  slug: string;
};
export type pageOrganizationMembersViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationMembersViewClientComponentFragment" | "pageOrganizationMembersMetadataFragment">;
};
export type pageOrganizationMembersViewQuery = {
  response: pageOrganizationMembersViewQuery$data;
  variables: pageOrganizationMembersViewQuery$variables;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAdmin",
  "storageKey": null
},
v10 = {
  "kind": "Variable",
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v11 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  (v10/*: any*/)
],
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v13 = {
  "kind": "InlineFragment",
  "selections": [
    (v12/*: any*/)
  ],
  "type": "Node",
  "abstractKey": "__isNode"
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageOrganizationMembersViewQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pageOrganizationMembersMetadataFragment",
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
                  (v9/*: any*/)
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
          (v10/*: any*/),
          (v2/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "OrganizationMembersViewClientComponentFragment"
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
    "name": "pageOrganizationMembersViewQuery",
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
              (v9/*: any*/),
              {
                "alias": null,
                "args": (v11/*: any*/),
                "concreteType": "OrganizationMemberConnection",
                "kind": "LinkedField",
                "name": "members",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "OrganizationMemberEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Account",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v12/*: any*/),
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
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "role",
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
                "args": (v11/*: any*/),
                "filters": [
                  "searchTerm"
                ],
                "handle": "connection",
                "key": "OrganizationMembersListInternalFragment_members",
                "kind": "LinkedHandle",
                "name": "members"
              },
              (v12/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "adminCount",
                "storageKey": null
              }
            ],
            "type": "Organization",
            "abstractKey": null
          },
          (v13/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "sudoModeExpiresAt",
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          (v13/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "756f791549ba1a94495b2cbcafd38543",
    "id": null,
    "metadata": {},
    "name": "pageOrganizationMembersViewQuery",
    "operationKind": "query",
    "text": "query pageOrganizationMembersViewQuery(\n  $slug: String!\n  $searchTerm: String\n) {\n  ...pageOrganizationMembersMetadataFragment_20J5Pl\n  ...OrganizationMembersViewClientComponentFragment_113nns\n}\n\nfragment DemoteMemberModalFragment on OrganizationMemberEdge {\n  node {\n    id\n  }\n}\n\nfragment DemoteMemberModalOrganizationFragment on Organization {\n  id\n}\n\nfragment InviteMemberModalFragment on Organization {\n  id\n}\n\nfragment MemberAccountFragment on Account {\n  ...MemberControlsAccountFragment\n}\n\nfragment MemberControlsAccountFragment on Account {\n  sudoModeExpiresAt\n}\n\nfragment MemberControlsFragment on OrganizationMemberEdge {\n  role\n  node {\n    fullName\n    id\n  }\n  ...RemoveMemberModalFragment\n  ...DemoteMemberModalFragment\n  ...PromoteMemberModalFragment\n}\n\nfragment MemberControlsOrganizationFragment on Organization {\n  ...RemoveMemberModalOrganizationFragment\n  ...DemoteMemberModalOrganizationFragment\n  ...PromoteMemberModalOrganizationFragment\n  adminCount\n}\n\nfragment MemberFragment on OrganizationMemberEdge {\n  role\n  createdAt\n  node {\n    fullName\n    avatarUrl\n    id\n  }\n  ...MemberControlsFragment\n}\n\nfragment MemberOrganizationFragment on Organization {\n  isAdmin\n  ...MemberControlsOrganizationFragment\n}\n\nfragment OrganizationMembersControllerFragment_20J5Pl on Query {\n  organization(slug: $slug) {\n    __typename\n    ... on Organization {\n      isAdmin\n      ...InviteMemberModalFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment OrganizationMembersListFragment_113nns on Query {\n  organization(slug: $slug) {\n    __typename\n    ... on Organization {\n      ...OrganizationMembersListInternalFragment_1CW4ID\n      ...MemberOrganizationFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n  viewer {\n    __typename\n    ... on Account {\n      ...MemberAccountFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment OrganizationMembersListInternalFragment_1CW4ID on Organization {\n  members(first: 10, searchTerm: $searchTerm) {\n    edges {\n      node {\n        id\n        __typename\n      }\n      ...MemberFragment\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n  id\n}\n\nfragment OrganizationMembersViewClientComponentFragment_113nns on Query {\n  ...OrganizationMembersViewFragment_113nns\n}\n\nfragment OrganizationMembersViewFragment_113nns on Query {\n  ...OrganizationMembersListFragment_113nns\n  ...OrganizationMembersControllerFragment_20J5Pl\n}\n\nfragment PromoteMemberModalFragment on OrganizationMemberEdge {\n  node {\n    id\n  }\n}\n\nfragment PromoteMemberModalOrganizationFragment on Organization {\n  id\n}\n\nfragment RemoveMemberModalFragment on OrganizationMemberEdge {\n  node {\n    id\n  }\n}\n\nfragment RemoveMemberModalOrganizationFragment on Organization {\n  id\n}\n\nfragment pageOrganizationMembersMetadataFragment_20J5Pl on Query {\n  organization(slug: $slug) {\n    __typename\n    ... on Organization {\n      name\n      description\n      logoUrl\n      isMember\n      isAdmin\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6d2ae84fe2a5aac38c5c069151974bb7";

export default node;
