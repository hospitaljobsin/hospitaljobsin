/**
 * @generated SignedSource<<5ae4c4f1231ba9f428f37a1144cd4ed5>>
 * @relayHash 76889375576ec1d469c27ee2047b2dd8
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 76889375576ec1d469c27ee2047b2dd8

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type notFoundJobDetailQuery$variables = Record<PropertyKey, never>;
export type notFoundJobDetailQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment">;
};
export type notFoundJobDetailQuery = {
  response: notFoundJobDetailQuery$data;
  variables: notFoundJobDetailQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "notFoundJobDetailQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "DashboardHeaderFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "notFoundJobDetailQuery",
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
                "name": "avatarUrl",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "progressPercentage",
                    "storageKey": null
                  },
                  (v0/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v0/*: any*/)
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
    "id": "76889375576ec1d469c27ee2047b2dd8",
    "metadata": {},
    "name": "notFoundJobDetailQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "7e02db4ce57a864e11a92d7455891571";

export default node;
