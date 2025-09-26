/**
 * @generated SignedSource<<d24c07c2c8ef92a543806afc912d5527>>
 * @relayHash 646df2213c92adbb6e4a7765f576add3
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 646df2213c92adbb6e4a7765f576add3

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type DeleteAvatarModalMutation$variables = Record<PropertyKey, never>;
export type DeleteAvatarModalMutation$data = {
  readonly removeAccountAvatar: {
    readonly __typename: "Account";
    readonly " $fragmentSpreads": FragmentRefs<"AccountDetailsFragment" | "AuthNavigationFragment">;
  };
};
export type DeleteAvatarModalMutation = {
  response: DeleteAvatarModalMutation$data;
  variables: DeleteAvatarModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteAvatarModalMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "removeAccountAvatar",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "AccountDetailsFragment"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "AuthNavigationFragment"
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "DeleteAvatarModalMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "removeAccountAvatar",
        "plural": false,
        "selections": [
          (v0/*: any*/),
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
            "name": "email",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "avatarUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "646df2213c92adbb6e4a7765f576add3",
    "metadata": {},
    "name": "DeleteAvatarModalMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "8382656c5e44418fda3083020622acf6";

export default node;
