/**
 * @generated SignedSource<<1e722a6d6adc61fa75d1f536b6d659f4>>
 * @relayHash 20fd47bf624144aa893b1af2285611fd
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 20fd47bf624144aa893b1af2285611fd

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageRequestSudoModeViewQuery$variables = Record<PropertyKey, never>;
export type pageRequestSudoModeViewQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"RequestSudoModeViewClientComponentFragment" | "pageRequestSudoModeInternalFragment">;
};
export type pageRequestSudoModeViewQuery = {
  response: pageRequestSudoModeViewQuery$data;
  variables: pageRequestSudoModeViewQuery$variables;
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
  "name": "sudoModeExpiresAt",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageRequestSudoModeViewQuery",
    "selections": [
      {
        "kind": "InlineDataFragmentSpread",
        "name": "pageRequestSudoModeInternalFragment",
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "viewer",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v1/*: any*/)
                ],
                "type": "Account",
                "abstractKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "args": null,
        "argumentDefinitions": []
      },
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "RequestSudoModeViewClientComponentFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "pageRequestSudoModeViewQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "viewer",
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
                "name": "authProviders",
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
                "name": "has2faEnabled",
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
    "id": "20fd47bf624144aa893b1af2285611fd",
    "metadata": {},
    "name": "pageRequestSudoModeViewQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "260e821538c74ae0966ebea3fde7be7d";

export default node;
