/**
 * @generated SignedSource<<2b658921337643d7e4356c23559a17b7>>
 * @relayHash 2010c3a831766e30891050afd89ebbdb
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 2010c3a831766e30891050afd89ebbdb

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type DeleteAvatarModalMutation$variables = Record<PropertyKey, never>;
export type DeleteAvatarModalMutation$data = {
  readonly removeAccountAvatar: {
    readonly __typename: "Account";
    readonly " $fragmentSpreads": FragmentRefs<"AccountDetailsFragment" | "AuthNavigationFragment" | "UpdateAccountDetailsFormFragment">;
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
            "name": "UpdateAccountDetailsFormFragment"
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
    "id": "2010c3a831766e30891050afd89ebbdb",
    "metadata": {},
    "name": "DeleteAvatarModalMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "ab6ec35e270e5e7ff318299dfc25b7fc";

export default node;
