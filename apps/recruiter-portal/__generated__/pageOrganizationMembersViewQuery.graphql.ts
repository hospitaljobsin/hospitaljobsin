/**
 * @generated SignedSource<<474a940c76d34341c4c4ed40198107e8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
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
    "cacheID": "10989f6c0c8c66c66d971176a44f4c02",
    "id": null,
    "metadata": {},
    "name": "pageOrganizationMembersViewQuery",
    "operationKind": "query",
    "text": "query pageOrganizationMembersViewQuery($slug:String!,$searchTerm:String){...pageOrganizationMembersMetadataFragment_20J5Pl,...OrganizationMembersViewClientComponentFragment_113nns}fragment DemoteMemberModalFragment on OrganizationMemberEdge{node{id}}fragment DemoteMemberModalOrganizationFragment on Organization{id}fragment InviteMemberModalFragment on Organization{id}fragment MemberAccountFragment on Account{...MemberControlsAccountFragment}fragment MemberControlsAccountFragment on Account{sudoModeExpiresAt}fragment MemberControlsFragment on OrganizationMemberEdge{role,node{fullName,id},...RemoveMemberModalFragment,...DemoteMemberModalFragment,...PromoteMemberModalFragment}fragment MemberControlsOrganizationFragment on Organization{...RemoveMemberModalOrganizationFragment,...DemoteMemberModalOrganizationFragment,...PromoteMemberModalOrganizationFragment,adminCount}fragment MemberFragment on OrganizationMemberEdge{role,createdAt,node{fullName,avatarUrl,id},...MemberControlsFragment}fragment MemberOrganizationFragment on Organization{isAdmin,...MemberControlsOrganizationFragment}fragment OrganizationMembersControllerFragment_20J5Pl on Query{organization(slug:$slug){__typename,...on Organization{isAdmin,...InviteMemberModalFragment},...on Node{__isNode:__typename,id}}}fragment OrganizationMembersListFragment_113nns on Query{organization(slug:$slug){__typename,...on Organization{...OrganizationMembersListInternalFragment_1CW4ID,...MemberOrganizationFragment},...on Node{__isNode:__typename,id}},viewer{__typename,...on Account{...MemberAccountFragment},...on Node{__isNode:__typename,id}}}fragment OrganizationMembersListInternalFragment_1CW4ID on Organization{members(first:10,searchTerm:$searchTerm){edges{node{id,__typename},...MemberFragment,cursor},pageInfo{hasNextPage,endCursor}},id}fragment OrganizationMembersViewClientComponentFragment_113nns on Query{...OrganizationMembersViewFragment_113nns}fragment OrganizationMembersViewFragment_113nns on Query{...OrganizationMembersListFragment_113nns,...OrganizationMembersControllerFragment_20J5Pl}fragment PromoteMemberModalFragment on OrganizationMemberEdge{node{id}}fragment PromoteMemberModalOrganizationFragment on Organization{id}fragment RemoveMemberModalFragment on OrganizationMemberEdge{node{id}}fragment RemoveMemberModalOrganizationFragment on Organization{id}fragment pageOrganizationMembersMetadataFragment_20J5Pl on Query{organization(slug:$slug){__typename,...on Organization{name,description,logoUrl,isMember,isAdmin},...on Node{__isNode:__typename,id}}}"
  }
};
})();

(node as any).hash = "6d2ae84fe2a5aac38c5c069151974bb7";

export default node;
