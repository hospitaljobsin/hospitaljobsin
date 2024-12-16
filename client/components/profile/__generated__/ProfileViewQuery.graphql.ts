/**
 * @generated SignedSource<<98f91954d90e840b5af3664ff8ac98e0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProfileViewQuery$variables = Record<PropertyKey, never>;
export type ProfileViewQuery$data = {
  readonly viewer: {
    readonly __typename: "Account";
    readonly " $fragmentSpreads": FragmentRefs<"EmploymentDetailsFragment" | "PersonalDetailsFragment" | "ProfileHeaderFragment">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type ProfileViewQuery = {
  response: ProfileViewQuery$data;
  variables: ProfileViewQuery$variables;
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
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "Node",
  "abstractKey": "__isNode"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ProfileViewQuery",
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
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ProfileHeaderFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "PersonalDetailsFragment"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "EmploymentDetailsFragment"
              }
            ],
            "type": "Account",
            "abstractKey": null
          }
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
    "name": "ProfileViewQuery",
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
                "name": "email",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  (v1/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          (v1/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "01c5db1654bcafb89f6f042e22b82152",
    "id": null,
    "metadata": {},
    "name": "ProfileViewQuery",
    "operationKind": "query",
    "text": "query ProfileViewQuery {\n  viewer {\n    __typename\n    ... on Account {\n      ...ProfileHeaderFragment\n      ...PersonalDetailsFragment\n      ...EmploymentDetailsFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment EmploymentDetailsFragment on Account {\n  profile {\n    __typename\n    ... on Profile {\n      __typename\n    }\n    ... on ProfileNotFoundError {\n      __typename\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment PersonalDetailsFragment on Account {\n  profile {\n    __typename\n    ... on Profile {\n      __typename\n    }\n    ... on ProfileNotFoundError {\n      __typename\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment ProfileHeaderFragment on Account {\n  fullName\n  email\n}\n"
  }
};
})();

(node as any).hash = "d15e23bde181421faa04269b5c9e8c59";

export default node;
