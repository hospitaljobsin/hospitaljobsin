/**
 * @generated SignedSource<<0ba380c3494ab7af9ee13cbf703978eb>>
 * @relayHash 55e0fe3fd57295d5e502c453e14476cb
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 55e0fe3fd57295d5e502c453e14476cb

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ResumeProgressClientComponentQuery$variables = Record<PropertyKey, never>;
export type ResumeProgressClientComponentQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ResumeProgressFragment">;
};
export type ResumeProgressClientComponentQuery = {
  response: ResumeProgressClientComponentQuery$data;
  variables: ResumeProgressClientComponentQuery$variables;
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
    "name": "ResumeProgressClientComponentQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "ResumeProgressFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ResumeProgressClientComponentQuery",
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
    "id": "55e0fe3fd57295d5e502c453e14476cb",
    "metadata": {},
    "name": "ResumeProgressClientComponentQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "85c4344054d3d1505048f2d9b18f3f93";

export default node;
