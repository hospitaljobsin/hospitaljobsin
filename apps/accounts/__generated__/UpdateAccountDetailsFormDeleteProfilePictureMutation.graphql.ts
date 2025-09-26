/**
 * @generated SignedSource<<2ea8ea92bfdaf52bac45bd2a1e5cab97>>
 * @relayHash 78a28a908a3e482603301e19a20be85a
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 78a28a908a3e482603301e19a20be85a

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateAccountDetailsFormDeleteProfilePictureMutation$variables = Record<PropertyKey, never>;
export type UpdateAccountDetailsFormDeleteProfilePictureMutation$data = {
  readonly removeAccountAvatar: {
    readonly __typename: "Account";
    readonly " $fragmentSpreads": FragmentRefs<"AccountDetailsFragment" | "AuthNavigationFragment" | "UpdateAccountDetailsFormFragment">;
  };
};
export type UpdateAccountDetailsFormDeleteProfilePictureMutation = {
  response: UpdateAccountDetailsFormDeleteProfilePictureMutation$data;
  variables: UpdateAccountDetailsFormDeleteProfilePictureMutation$variables;
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
    "name": "UpdateAccountDetailsFormDeleteProfilePictureMutation",
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
            "name": "UpdateAccountDetailsFormFragment"
          },
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
    "name": "UpdateAccountDetailsFormDeleteProfilePictureMutation",
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
    "id": "78a28a908a3e482603301e19a20be85a",
    "metadata": {},
    "name": "UpdateAccountDetailsFormDeleteProfilePictureMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "b61d902d9b2a7ba6b6747516ab227eb2";

export default node;
