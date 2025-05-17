/**
 * @generated SignedSource<<491883cb484d45f959e0147a0a4ec9b9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type InviteFormDeclineMutation$variables = {
  inviteToken: string;
};
export type InviteFormDeclineMutation$data = {
  readonly declineOrganizationInvite: {
    readonly __typename: "OrganizationInviteEdge";
    readonly __typename: "OrganizationInviteEdge";
  } | {
    readonly __typename: "OrganizationInviteNotFoundError";
    readonly __typename: "OrganizationInviteNotFoundError";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type InviteFormDeclineMutation = {
  response: InviteFormDeclineMutation$data;
  variables: InviteFormDeclineMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "inviteToken"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "inviteToken",
        "variableName": "inviteToken"
      }
    ],
    "concreteType": null,
    "kind": "LinkedField",
    "name": "declineOrganizationInvite",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "InviteFormDeclineMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "InviteFormDeclineMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "714c3f2b900b72adb2c6061f40f8a750",
    "id": null,
    "metadata": {},
    "name": "InviteFormDeclineMutation",
    "operationKind": "mutation",
    "text": "mutation InviteFormDeclineMutation(\n  $inviteToken: String!\n) {\n  declineOrganizationInvite(inviteToken: $inviteToken) {\n    __typename\n    ... on OrganizationInviteEdge {\n      __typename\n    }\n    ... on OrganizationInviteNotFoundError {\n      __typename\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fb61849c3a0e054ace3e11f7280e0c0a";

export default node;
