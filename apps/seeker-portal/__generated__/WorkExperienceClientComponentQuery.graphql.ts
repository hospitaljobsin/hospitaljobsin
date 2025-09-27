/**
 * @generated SignedSource<<5d82fceaf40734fdcdb2fcc8a33c0cb3>>
 * @relayHash 802508cd8e078d0eb0723c43d5a11aa3
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 802508cd8e078d0eb0723c43d5a11aa3

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type WorkExperienceClientComponentQuery$variables = Record<PropertyKey, never>;
export type WorkExperienceClientComponentQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"WorkExperienceViewFragment">;
};
export type WorkExperienceClientComponentQuery = {
  response: WorkExperienceClientComponentQuery$data;
  variables: WorkExperienceClientComponentQuery$variables;
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
    "name": "WorkExperienceClientComponentQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "WorkExperienceViewFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "WorkExperienceClientComponentQuery",
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
    "id": "802508cd8e078d0eb0723c43d5a11aa3",
    "metadata": {},
    "name": "WorkExperienceClientComponentQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "594b886d07163945c5cbeca2da043dac";

export default node;
