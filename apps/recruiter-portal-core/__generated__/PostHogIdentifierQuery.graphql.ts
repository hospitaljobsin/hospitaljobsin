/**
 * @generated SignedSource<<5be81093c7fd714022a9895ca94fffb4>>
 * @relayHash c3593512cd952305729d0a8b200b7c8e
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c3593512cd952305729d0a8b200b7c8e

import type { ConcreteRequest } from 'relay-runtime';
export type PostHogIdentifierQuery$variables = Record<PropertyKey, never>;
export type PostHogIdentifierQuery$data = {
  readonly viewer: {
    readonly __typename: "Account";
    readonly __typename: "Account";
    readonly email: string;
    readonly id: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type PostHogIdentifierQuery = {
  response: PostHogIdentifierQuery$data;
  variables: PostHogIdentifierQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "kind": "InlineFragment",
  "selections": [
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PostHogIdentifierQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PostHogIdentifierQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v1/*: any*/)
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
    "id": "c3593512cd952305729d0a8b200b7c8e",
    "metadata": {},
    "name": "PostHogIdentifierQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "84b5042ce58a947bdda7e00b80c6f02f";

export default node;
