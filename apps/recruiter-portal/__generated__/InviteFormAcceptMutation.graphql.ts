/**
 * @generated SignedSource<<86eb463d8e85deae0b9a71353f3de058>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
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
    "cacheID": "39b20f2f0723f37671b17a7404445051",
    "id": null,
    "metadata": {},
    "name": "InviteFormAcceptMutation",
    "operationKind": "mutation",
    "text": "mutation InviteFormAcceptMutation(\n  $inviteToken: String!\n) {\n  acceptOrganizationInvite(inviteToken: $inviteToken) {\n    __typename\n    ... on OrganizationInviteEdge {\n      __typename\n    }\n    ... on OrganizationInviteNotFoundError {\n      __typename\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "65b3332d4c8b8771540f463a90993796";

export default node;
