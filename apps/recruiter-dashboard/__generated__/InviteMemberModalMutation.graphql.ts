/**
 * @generated SignedSource<<ce3d8ee6079dc3eb0b9fdf0199bc8edb>>
 * @relayHash 366395923789ca174b268b88106581b1
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 366395923789ca174b268b88106581b1

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationMemberRole = "ADMIN" | "MEMBER" | "%future added value";
export type InviteMemberModalMutation$variables = {
  email: string;
  memberRole: OrganizationMemberRole;
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
  "name": "memberRole"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "organizationId"
},
v3 = [
  {
    "kind": "Variable",
    "name": "email",
    "variableName": "email"
  },
  {
    "kind": "Variable",
    "name": "memberRole",
    "variableName": "memberRole"
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
},
v6 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "message",
    "storageKey": null
  }
],
v7 = {
  "kind": "InlineFragment",
  "selections": (v6/*: any*/),
  "type": "InvalidEmailError",
  "abstractKey": null
},
v8 = {
  "kind": "InlineFragment",
  "selections": (v6/*: any*/),
  "type": "MemberAlreadyExistsError",
  "abstractKey": null
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
    "name": "InviteMemberModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "createOrganizationInvite",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v5/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "InviteFragment"
              }
            ],
            "type": "OrganizationInvite",
            "abstractKey": null
          },
          (v7/*: any*/),
          (v8/*: any*/)
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
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "InviteMemberModalMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "createOrganizationInvite",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v5/*: any*/),
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
                  (v5/*: any*/)
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
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v5/*: any*/)
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
    "id": "366395923789ca174b268b88106581b1",
    "metadata": {},
    "name": "InviteMemberModalMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "260857e48179636148982c3ca00a50f8";

export default node;
