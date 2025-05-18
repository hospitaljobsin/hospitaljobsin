/**
 * @generated SignedSource<<9fef249cec0c2f560a377f6cdfc8618d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type InviteMemberModalMutation$variables = {
  email: string;
  organizationId: string;
};
export type InviteMemberModalMutation$data = {
  readonly createOrganizationInvite: {
    readonly __typename: "InvalidEmailError";
    readonly __typename: "InvalidEmailError";
    readonly message: string;
  } | {
    readonly __typename: "MemberAlreadyExistsError";
    readonly __typename: "MemberAlreadyExistsError";
    readonly message: string;
  } | {
    readonly __typename: "OrganizationAuthorizationError";
    readonly __typename: "OrganizationAuthorizationError";
  } | {
    readonly __typename: "OrganizationInvite";
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"InviteFragment">;
  } | {
    readonly __typename: "OrganizationNotFoundError";
    readonly __typename: "OrganizationNotFoundError";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type InviteMemberModalMutation = {
  response: InviteMemberModalMutation$data;
  variables: InviteMemberModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "email"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "organizationId"
},
v2 = [
  {
    "kind": "Variable",
    "name": "email",
    "variableName": "email"
  },
  {
    "kind": "Variable",
    "name": "organizationId",
    "variableName": "organizationId"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v6 = {
  "kind": "InlineFragment",
  "selections": (v5/*: any*/),
  "type": "InvalidEmailError",
  "abstractKey": null
},
v7 = {
  "kind": "InlineFragment",
  "selections": (v5/*: any*/),
  "type": "MemberAlreadyExistsError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "InviteMemberModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "createOrganizationInvite",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v4/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "InviteFragment"
              }
            ],
            "type": "OrganizationInvite",
            "abstractKey": null
          },
          (v6/*: any*/),
          (v7/*: any*/)
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
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "InviteMemberModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "createOrganizationInvite",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v4/*: any*/),
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
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "createdAt",
                "storageKey": null
              }
            ],
            "type": "OrganizationInvite",
            "abstractKey": null
          },
          (v6/*: any*/),
          (v7/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v4/*: any*/)
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
    "cacheID": "98395d8bd6bb770a498d4f4071009fbc",
    "id": null,
    "metadata": {},
    "name": "InviteMemberModalMutation",
    "operationKind": "mutation",
    "text": "mutation InviteMemberModalMutation($organizationId:ID!,$email:String!){createOrganizationInvite(organizationId:$organizationId,email:$email){__typename,...on OrganizationInvite{id,...InviteFragment},...on InvalidEmailError{__typename,message},...on OrganizationNotFoundError{__typename},...on MemberAlreadyExistsError{__typename,message},...on OrganizationAuthorizationError{__typename},...on Node{__isNode:__typename,id}}}fragment DeleteInviteModalFragment on OrganizationInvite{id,email}fragment InviteFragment on OrganizationInvite{email,status,expiresAt,createdBy{fullName,avatarUrl,id},createdAt,...DeleteInviteModalFragment}"
  }
};
})();

(node as any).hash = "473fdeb540707888373e554b5d0cd19c";

export default node;
