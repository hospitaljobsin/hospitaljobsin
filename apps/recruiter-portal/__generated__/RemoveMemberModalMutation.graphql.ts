/**
 * @generated SignedSource<<33984d163a3b8382ecbec1cc74c68cb2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type RemoveMemberModalMutation$variables = {
  accountId: string;
  connections: ReadonlyArray<string>;
  organizationId: string;
};
export type RemoveMemberModalMutation$data = {
  readonly removeOrganizationMember: {
    readonly __typename: "OrganizationAuthorizationError";
    readonly __typename: "OrganizationAuthorizationError";
  } | {
    readonly __typename: "OrganizationMemberNotFoundError";
    readonly __typename: "OrganizationMemberNotFoundError";
  } | {
    readonly __typename: "OrganizationNotFoundError";
    readonly __typename: "OrganizationNotFoundError";
  } | {
    readonly __typename: "RemoveOrganizationMemberSuccess";
    readonly organization: {
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"MemberControlsOrganizationFragment">;
    };
    readonly organizationMemberEdge: {
      readonly node: {
        readonly id: string;
      };
    };
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type RemoveMemberModalMutation = {
  response: RemoveMemberModalMutation$data;
  variables: RemoveMemberModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "accountId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "organizationId"
},
v3 = [
  {
    "kind": "Variable",
    "name": "accountId",
    "variableName": "accountId"
  },
  {
    "kind": "Variable",
    "name": "organizationId",
    "variableName": "organizationId"
  }
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
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveMemberModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "removeOrganizationMember",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "OrganizationMemberEdge",
                "kind": "LinkedField",
                "name": "organizationMemberEdge",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Account",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Organization",
                "kind": "LinkedField",
                "name": "organization",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "MemberControlsOrganizationFragment"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "RemoveOrganizationMemberSuccess",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "RemoveMemberModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "removeOrganizationMember",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "OrganizationMemberEdge",
                "kind": "LinkedField",
                "name": "organizationMemberEdge",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Account",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "filters": null,
                        "handle": "deleteEdge",
                        "key": "",
                        "kind": "ScalarHandle",
                        "name": "id",
                        "handleArgs": [
                          {
                            "kind": "Variable",
                            "name": "connections",
                            "variableName": "connections"
                          }
                        ]
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Organization",
                "kind": "LinkedField",
                "name": "organization",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "adminCount",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "RemoveOrganizationMemberSuccess",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "336342981505b7bc3238782593824e19",
    "id": null,
    "metadata": {},
    "name": "RemoveMemberModalMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveMemberModalMutation($accountId:ID!,$organizationId:ID!){removeOrganizationMember(accountId:$accountId,organizationId:$organizationId){__typename,...on RemoveOrganizationMemberSuccess{organizationMemberEdge{node{id}},organization{id,...MemberControlsOrganizationFragment}},...on OrganizationNotFoundError{__typename},...on OrganizationMemberNotFoundError{__typename},...on OrganizationAuthorizationError{__typename}}}fragment DemoteMemberModalOrganizationFragment on Organization{id}fragment MemberControlsOrganizationFragment on Organization{...RemoveMemberModalOrganizationFragment,...DemoteMemberModalOrganizationFragment,...PromoteMemberModalOrganizationFragment,adminCount}fragment PromoteMemberModalOrganizationFragment on Organization{id}fragment RemoveMemberModalOrganizationFragment on Organization{id}"
  }
};
})();

(node as any).hash = "bab0af0e6dbd2d85d99a6d458dd2cac5";

export default node;
