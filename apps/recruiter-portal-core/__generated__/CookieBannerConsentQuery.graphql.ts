/**
 * @generated SignedSource<<1528ffbe39a43925749c6a222c836a98>>
 * @relayHash c5e3f9ea24e348e0ceef874495828aff
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c5e3f9ea24e348e0ceef874495828aff

import type { ConcreteRequest } from 'relay-runtime';
export type AnalyticsPreferenceType = "ACCEPTANCE" | "REJECTION" | "UNDECIDED" | "%future added value";
export type CookieBannerConsentQuery$variables = Record<PropertyKey, never>;
export type CookieBannerConsentQuery$data = {
  readonly viewer: {
    readonly __typename: "Account";
    readonly __typename: "Account";
    readonly analyticsPreference: {
      readonly type: AnalyticsPreferenceType;
    };
    readonly id: string;
  } | {
    readonly __typename: "NotAuthenticatedError";
    readonly __typename: "NotAuthenticatedError";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type CookieBannerConsentQuery = {
  response: CookieBannerConsentQuery$data;
  variables: CookieBannerConsentQuery$variables;
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
      "concreteType": "AnalyticsPreference",
      "kind": "LinkedField",
      "name": "analyticsPreference",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "type",
          "storageKey": null
        }
      ],
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
    "name": "CookieBannerConsentQuery",
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
    "name": "CookieBannerConsentQuery",
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
    "id": "c5e3f9ea24e348e0ceef874495828aff",
    "metadata": {},
    "name": "CookieBannerConsentQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "4c69546f76ae13d581feeccf145996a6";

export default node;
