/**
 * @generated SignedSource<<7b5d16495384a42111997c07cd85ffe0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DeletePasswordModalMutation$variables = Record<PropertyKey, never>;
export type DeletePasswordModalMutation$data = {
  readonly deletePassword: {
    readonly __typename: "Account";
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"PasswordFragment">;
  } | {
    readonly __typename: "InsufficientAuthProvidersError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type DeletePasswordModalMutation = {
  response: DeletePasswordModalMutation$data;
  variables: DeletePasswordModalMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "message",
      "storageKey": null
    }
  ],
  "type": "InsufficientAuthProvidersError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "DeletePasswordModalMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "deletePassword",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v1/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "PasswordFragment"
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          (v2/*: any*/)
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
    "name": "DeletePasswordModalMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "deletePassword",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "sudoModeExpiresAt",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "authProviders",
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v1/*: any*/)
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
    "cacheID": "3241a50e9f4a7a3d88b19d64b72f88be",
    "id": null,
    "metadata": {},
    "name": "DeletePasswordModalMutation",
    "operationKind": "mutation",
    "text": "mutation DeletePasswordModalMutation {\n  deletePassword {\n    __typename\n    ... on Account {\n      id\n      ...PasswordFragment\n    }\n    ... on InsufficientAuthProvidersError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment PasswordFragment on Account {\n  sudoModeExpiresAt\n  authProviders\n  ...UpdatePasswordModalFragment\n}\n\nfragment UpdatePasswordModalFragment on Account {\n  authProviders\n}\n"
  }
};
})();

(node as any).hash = "8376f7dd828c1f8e1cc6e98486dda4fb";

export default node;
