/**
 * @generated SignedSource<<96e65cb515d7caa994cab9c849d8fdd0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type HeaderLogoutMutation$variables = Record<PropertyKey, never>;
export type HeaderLogoutMutation$data = {
  readonly logout: {
    readonly id?: string;
  };
};
export type HeaderLogoutMutation = {
  response: HeaderLogoutMutation$data;
  variables: HeaderLogoutMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  (v0/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "HeaderLogoutMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "logout",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": (v1/*: any*/),
            "type": "Account",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "HeaderLogoutMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "logout",
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
              (v0/*: any*/),
              {
                "alias": null,
                "args": null,
                "filters": null,
                "handle": "deleteRecord",
                "key": "",
                "kind": "ScalarHandle",
                "name": "id"
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": (v1/*: any*/),
            "type": "Node",
            "abstractKey": "__isNode"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "83c5b4662689b143281def36e55a88fa",
    "id": null,
    "metadata": {},
    "name": "HeaderLogoutMutation",
    "operationKind": "mutation",
    "text": "mutation HeaderLogoutMutation {\n  logout {\n    __typename\n    ... on Account {\n      id\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c1a781801c6d459682865ba8e35fe4fa";

export default node;
