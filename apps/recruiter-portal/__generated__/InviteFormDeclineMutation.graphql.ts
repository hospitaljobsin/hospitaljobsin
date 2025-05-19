/**
 * @generated SignedSource<<8a0291ec2f5bfc0bc06acd5e540993f2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
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
    "cacheID": "45301f1eae91843e263067e06f6ca05c",
    "id": null,
    "metadata": {},
    "name": "InviteFormDeclineMutation",
    "operationKind": "mutation",
    "text": "mutation InviteFormDeclineMutation($inviteToken:String!){declineOrganizationInvite(inviteToken:$inviteToken){__typename,...on OrganizationInviteEdge{__typename},...on OrganizationInviteNotFoundError{__typename}}}"
  }
};
})();

(node as any).hash = "fb61849c3a0e054ace3e11f7280e0c0a";

export default node;
