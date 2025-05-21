/**
 * @generated SignedSource<<e4c4985d18587177edfcea11d44c9514>>
 * @relayHash 52f6e4ee077884e0c25b1f36e27465aa
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 52f6e4ee077884e0c25b1f36e27465aa

import type { ConcreteRequest } from 'relay-runtime';
export type InviteFormAcceptMutation$variables = {
  inviteToken: string;
};
export type InviteFormAcceptMutation$data = {
  readonly acceptOrganizationInvite: {
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
export type InviteFormAcceptMutation = {
  response: InviteFormAcceptMutation$data;
  variables: InviteFormAcceptMutation$variables;
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
    "name": "acceptOrganizationInvite",
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
    "name": "InviteFormAcceptMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "InviteFormAcceptMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "52f6e4ee077884e0c25b1f36e27465aa",
    "metadata": {},
    "name": "InviteFormAcceptMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "65b3332d4c8b8771540f463a90993796";

export default node;
