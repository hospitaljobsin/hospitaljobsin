/**
 * @generated SignedSource<<a6d7c9e6ce2c3f7284674a258eb4b2ac>>
 * @relayHash 6acc99be86bfb272c10e79df4c421a85
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 6acc99be86bfb272c10e79df4c421a85

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SummaryClientComponentQuery$variables = Record<PropertyKey, never>;
export type SummaryClientComponentQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"SummaryViewFragment">;
};
export type SummaryClientComponentQuery = {
  response: SummaryClientComponentQuery$data;
  variables: SummaryClientComponentQuery$variables;
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
    "name": "SummaryClientComponentQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "SummaryViewFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SummaryClientComponentQuery",
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
              (v0/*: any*/),
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
                    "name": "isComplete",
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
    "id": "6acc99be86bfb272c10e79df4c421a85",
    "metadata": {},
    "name": "SummaryClientComponentQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "9b30772c278787118afb9355e049f63f";

export default node;
