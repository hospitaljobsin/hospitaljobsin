/**
 * @generated SignedSource<<113a58c104c35566cd765d0a7936fec5>>
 * @relayHash f46eec0df59d202745cfd2f633f0735b
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID f46eec0df59d202745cfd2f633f0735b

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type EducationClientComponentQuery$variables = Record<PropertyKey, never>;
export type EducationClientComponentQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"EducationViewFragment">;
};
export type EducationClientComponentQuery = {
  response: EducationClientComponentQuery$data;
  variables: EducationClientComponentQuery$variables;
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
    "name": "EducationClientComponentQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "EducationViewFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "EducationClientComponentQuery",
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
    "id": "f46eec0df59d202745cfd2f633f0735b",
    "metadata": {},
    "name": "EducationClientComponentQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "4ac216be265141a5eb0c98d440eeae97";

export default node;
