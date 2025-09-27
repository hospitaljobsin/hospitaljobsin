/**
 * @generated SignedSource<<dc76e965f5bac045d8815a0072c88913>>
 * @relayHash 3a321e6292a58fc883ab6c22af3a600a
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 3a321e6292a58fc883ab6c22af3a600a

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type CertificationsClientComponentQuery$variables = Record<PropertyKey, never>;
export type CertificationsClientComponentQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"CertificationsViewFragment">;
};
export type CertificationsClientComponentQuery = {
  response: CertificationsClientComponentQuery$data;
  variables: CertificationsClientComponentQuery$variables;
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
    "name": "CertificationsClientComponentQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "CertificationsViewFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CertificationsClientComponentQuery",
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
    "id": "3a321e6292a58fc883ab6c22af3a600a",
    "metadata": {},
    "name": "CertificationsClientComponentQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "5cbfff44e7adc94a180b01bdde4c785b";

export default node;
