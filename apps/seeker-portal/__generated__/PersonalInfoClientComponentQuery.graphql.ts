/**
 * @generated SignedSource<<a5ae8f6cc7dc27b2b19b06e05b34f58a>>
 * @relayHash c35dccb6272e9dca7e01bd7e448fd0b1
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c35dccb6272e9dca7e01bd7e448fd0b1

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type PersonalInfoClientComponentQuery$variables = Record<PropertyKey, never>;
export type PersonalInfoClientComponentQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"PersonalInfoViewFragment">;
};
export type PersonalInfoClientComponentQuery = {
  response: PersonalInfoClientComponentQuery$data;
  variables: PersonalInfoClientComponentQuery$variables;
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
    "name": "PersonalInfoClientComponentQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "PersonalInfoViewFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PersonalInfoClientComponentQuery",
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
    "id": "c35dccb6272e9dca7e01bd7e448fd0b1",
    "metadata": {},
    "name": "PersonalInfoClientComponentQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "564ce00fadfab87e0fca86372a11f0dd";

export default node;
