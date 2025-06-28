/**
 * @generated SignedSource<<5f69c23dbcd31f8ea368f2999d07aa17>>
 * @relayHash 39ce2596d84ec7c6efcfd47c8b6ba568
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 39ce2596d84ec7c6efcfd47c8b6ba568

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageOrganizationMemberSettingsQuery$variables = {
  searchTerm?: string | null | undefined;
  slug: string;
};
export type pageOrganizationMemberSettingsQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"MemberSettingsTabFragment">;
};
export type pageOrganizationMemberSettingsQuery = {
  response: pageOrganizationMemberSettingsQuery$data;
  variables: pageOrganizationMemberSettingsQuery$variables;
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
  "name": "searchTerm",
  "variableName": "searchTerm"
},
v3 = {
  "kind": "Variable",
  "name": "slug",
  "variableName": "slug"
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v5 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  (v2/*: any*/)
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "kind": "InlineFragment",
  "selections": [
    (v6/*: any*/)
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
    "name": "pageOrganizationMemberSettingsQuery",
    "selections": [
      {
        "args": [
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "MemberSettingsTabFragment"
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
    "name": "pageOrganizationMemberSettingsQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          (v3/*: any*/)
        ],
        "concreteType": null,
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": (v5/*: any*/),
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
                          (v6/*: any*/),
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
                "args": (v5/*: any*/),
                "filters": [
                  "searchTerm"
                ],
                "handle": "connection",
                "key": "OrganizationMembersListInternalFragment_members",
                "kind": "LinkedHandle",
                "name": "members"
              },
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isAdmin",
                "storageKey": null
              },
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
          (v7/*: any*/)
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
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "39ce2596d84ec7c6efcfd47c8b6ba568",
    "metadata": {},
    "name": "pageOrganizationMemberSettingsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "21517bea27969af9eafbfdf79bc7f258";

export default node;
