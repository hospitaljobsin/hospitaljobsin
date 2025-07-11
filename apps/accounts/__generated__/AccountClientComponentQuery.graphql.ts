/**
 * @generated SignedSource<<9b141ba4902e60bec6b8bf68790f3aeb>>
 * @relayHash 6d6a1c22f17acf07a3787d1072602b27
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 6d6a1c22f17acf07a3787d1072602b27

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AccountClientComponentQuery$variables = Record<PropertyKey, never>;
export type AccountClientComponentQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"AccountSettingsViewFragment">;
};
export type AccountClientComponentQuery = {
  response: AccountClientComponentQuery$data;
  variables: AccountClientComponentQuery$variables;
};

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AccountClientComponentQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "AccountSettingsViewFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AccountClientComponentQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          {
            "kind": "InlineFragment",
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
                "name": "email",
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "size",
                    "value": 120
                  }
                ],
                "kind": "ScalarField",
                "name": "avatarUrl",
                "storageKey": "avatarUrl(size:120)"
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "has2faEnabled",
                "storageKey": null
              },
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
                "name": "twoFactorProviders",
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
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
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
    "id": "6d6a1c22f17acf07a3787d1072602b27",
    "metadata": {},
    "name": "AccountClientComponentQuery",
    "operationKind": "query",
    "text": null
  }
};

(node as any).hash = "c3d346d7eaeda2e58bef82d9d89a311f";

export default node;
