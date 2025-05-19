/**
 * @generated SignedSource<<3615d10f5001737d89d2a1377ee96273>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type PromoteMemberModalMutation$variables = {
  accountId: string;
  organizationId: string;
};
export type PromoteMemberModalMutation$data = {
  readonly promoteOrganizationMember: {
    readonly __typename: "OrganizationAuthorizationError";
    readonly __typename: "OrganizationAuthorizationError";
  } | {
    readonly __typename: "OrganizationMemberNotFoundError";
    readonly __typename: "OrganizationMemberNotFoundError";
  } | {
    readonly __typename: "OrganizationNotFoundError";
    readonly __typename: "OrganizationNotFoundError";
  } | {
    readonly __typename: "PromoteOrganizationMemberSuccess";
    readonly organization: {
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"MemberControlsOrganizationFragment">;
    };
    readonly organizationMemberEdge: {
      readonly " $fragmentSpreads": FragmentRefs<"MemberFragment">;
    };
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type PromoteMemberModalMutation = {
  response: PromoteMemberModalMutation$data;
  variables: PromoteMemberModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "accountId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "organizationId"
  }
],
v1 = [
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PromoteMemberModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "promoteOrganizationMember",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "MemberFragment"
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
                  (v3/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "MemberControlsOrganizationFragment"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "PromoteOrganizationMemberSuccess",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PromoteMemberModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "promoteOrganizationMember",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
                    "concreteType": "Account",
                    "kind": "LinkedField",
                    "name": "node",
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
                      (v3/*: any*/)
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
                  (v3/*: any*/),
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
            "type": "PromoteOrganizationMemberSuccess",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9b57414d5d810a0834b6321fa62bc8d3",
    "id": null,
    "metadata": {},
    "name": "PromoteMemberModalMutation",
    "operationKind": "mutation",
    "text": "mutation PromoteMemberModalMutation($accountId:ID!,$organizationId:ID!){promoteOrganizationMember(accountId:$accountId,organizationId:$organizationId){__typename,...on PromoteOrganizationMemberSuccess{organizationMemberEdge{...MemberFragment},organization{id,...MemberControlsOrganizationFragment}},...on OrganizationNotFoundError{__typename},...on OrganizationMemberNotFoundError{__typename},...on OrganizationAuthorizationError{__typename}}}fragment DemoteMemberModalFragment on OrganizationMemberEdge{node{id}}fragment DemoteMemberModalOrganizationFragment on Organization{id}fragment MemberControlsFragment on OrganizationMemberEdge{role,node{fullName,id},...RemoveMemberModalFragment,...DemoteMemberModalFragment,...PromoteMemberModalFragment}fragment MemberControlsOrganizationFragment on Organization{...RemoveMemberModalOrganizationFragment,...DemoteMemberModalOrganizationFragment,...PromoteMemberModalOrganizationFragment,adminCount}fragment MemberFragment on OrganizationMemberEdge{role,createdAt,node{fullName,avatarUrl,id},...MemberControlsFragment}fragment PromoteMemberModalFragment on OrganizationMemberEdge{node{id}}fragment PromoteMemberModalOrganizationFragment on Organization{id}fragment RemoveMemberModalFragment on OrganizationMemberEdge{node{id}}fragment RemoveMemberModalOrganizationFragment on Organization{id}"
  }
};
})();

(node as any).hash = "8aa9416c2b490545c4bf40883f630616";

export default node;
