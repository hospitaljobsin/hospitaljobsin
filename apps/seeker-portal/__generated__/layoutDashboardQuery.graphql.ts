/**
 * @generated SignedSource<<be95cc49528c79c12e85cf8ea60b333b>>
 * @relayHash 1428f8008d729862ece17e9e484daa9a
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 1428f8008d729862ece17e9e484daa9a

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type layoutDashboardQuery$variables = Record<PropertyKey, never>;
export type layoutDashboardQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderClientComponentFragment">;
};
export type layoutDashboardQuery = {
  response: layoutDashboardQuery$data;
  variables: layoutDashboardQuery$variables;
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
    "name": "layoutDashboardQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "DashboardHeaderClientComponentFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "layoutDashboardQuery",
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
    "id": "1428f8008d729862ece17e9e484daa9a",
    "metadata": {},
    "name": "layoutDashboardQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "ccf90de596d6bf84392328d71873456b";

export default node;
