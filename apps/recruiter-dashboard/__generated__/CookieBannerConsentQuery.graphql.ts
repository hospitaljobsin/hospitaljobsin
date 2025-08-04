/**
 * @generated SignedSource<<2e0ceff0575fde812906679139fc6faa>>
 * @relayHash 72f135592938ce6406fa7c4e49cf99bb
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 72f135592938ce6406fa7c4e49cf99bb

import type { ConcreteRequest } from 'relay-runtime';
export type TermsAndPolicyType = "ACCEPTANCE" | "REJECTION" | "UNDECIDED" | "%future added value";
export type CookieBannerConsentQuery$variables = Record<PropertyKey, never>;
export type CookieBannerConsentQuery$data = {
  readonly viewer: {
    readonly __typename: "Account";
    readonly __typename: "Account";
    readonly id: string;
    readonly termsAndPolicy: {
      readonly type: TermsAndPolicyType;
    };
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
      "concreteType": "TermsAndPolicy",
      "kind": "LinkedField",
      "name": "termsAndPolicy",
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
    "id": "72f135592938ce6406fa7c4e49cf99bb",
    "metadata": {},
    "name": "CookieBannerConsentQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "a0972270edd09ccf8e981babde102698";

export default node;
