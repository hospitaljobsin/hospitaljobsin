/**
 * @generated SignedSource<<eaf5b9d41aa6812add4bf6b0d7d9be3d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
export type LogoutModalMutation$variables = Record<PropertyKey, never>;
export type LogoutModalMutation$data = {
  readonly logout: {
    readonly __typename: "LogoutPayload";
  };
};
export type LogoutModalMutation = {
  response: LogoutModalMutation$data;
  variables: LogoutModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "LogoutPayload",
    "kind": "LinkedField",
    "name": "logout",
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LogoutModalMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "LogoutModalMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "e1a1d42b47907a4c6c5deff9de0b5cd9",
    "id": null,
    "metadata": {},
    "name": "LogoutModalMutation",
    "operationKind": "mutation",
    "text": "mutation LogoutModalMutation{logout{__typename}}"
  }
};
})();

(node as any).hash = "91fa2680a8488a9c50ddb25c2e04c5e6";

export default node;
