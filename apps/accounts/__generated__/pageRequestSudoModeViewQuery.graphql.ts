/**
 * @generated SignedSource<<5f338a0b308fe75cb876ec392520a81d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
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
    "cacheID": "20fd47bf624144aa893b1af2285611fd",
    "id": null,
    "metadata": {},
    "name": "pageRequestSudoModeViewQuery",
    "operationKind": "query",
    "text": "query pageRequestSudoModeViewQuery{...pageRequestSudoModeInternalFragment,...RequestSudoModeViewClientComponentFragment}fragment RequestSudoModeViewClientComponentFragment on Query{...RequestSudoViewFragment}fragment RequestSudoViewFragment on Query{viewer{__typename,...on Account{authProviders,twoFactorProviders,has2faEnabled},...on Node{__isNode:__typename,id}}}fragment pageRequestSudoModeInternalFragment on Query{viewer{__typename,...on Account{sudoModeExpiresAt},...on Node{__isNode:__typename,id}}}"
  }
};
})();

(node as any).hash = "260e821538c74ae0966ebea3fde7be7d";

export default node;
