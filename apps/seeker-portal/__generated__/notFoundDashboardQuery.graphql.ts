/**
 * @generated SignedSource<<c4b2d8733a56a3b71ecf70c318ed7df8>>
 * @relayHash 8c71bed2c94185ee2399d596237d5fe6
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 8c71bed2c94185ee2399d596237d5fe6

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type notFoundDashboardQuery$variables = Record<PropertyKey, never>;
export type notFoundDashboardQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment">;
};
export type notFoundDashboardQuery = {
  response: notFoundDashboardQuery$data;
  variables: notFoundDashboardQuery$variables;
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
    "name": "notFoundDashboardQuery",
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
    "name": "notFoundDashboardQuery",
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
    "id": "8c71bed2c94185ee2399d596237d5fe6",
    "metadata": {},
    "name": "notFoundDashboardQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "10758d2a7ea17fd42ebb8be4fa3f0303";

export default node;
