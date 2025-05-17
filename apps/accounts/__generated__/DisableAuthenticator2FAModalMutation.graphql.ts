/**
 * @generated SignedSource<<97246b80caefabcc652a21b238d74896>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DisableAuthenticator2FAModalMutation$variables = Record<PropertyKey, never>;
export type DisableAuthenticator2FAModalMutation$data = {
  readonly disableAccount2faWithAuthenticator: {
    readonly __typename: "Account";
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"TwoFactorAuthenticationFragment">;
  } | {
    readonly __typename: "AuthenticatorNotEnabledError";
    readonly message: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type DisableAuthenticator2FAModalMutation = {
  response: DisableAuthenticator2FAModalMutation$data;
  variables: DisableAuthenticator2FAModalMutation$variables;
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
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "message",
      "storageKey": null
    }
  ],
  "type": "AuthenticatorNotEnabledError",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "DisableAuthenticator2FAModalMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "disableAccount2faWithAuthenticator",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v1/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "TwoFactorAuthenticationFragment"
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          (v2/*: any*/)
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
    "name": "DisableAuthenticator2FAModalMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "disableAccount2faWithAuthenticator",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "has2faEnabled",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "sudoModeExpiresAt",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "twoFactorProviders",
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
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
    "cacheID": "6064c360c236056772749c543b027137",
    "id": null,
    "metadata": {},
    "name": "DisableAuthenticator2FAModalMutation",
    "operationKind": "mutation",
    "text": "mutation DisableAuthenticator2FAModalMutation {\n  disableAccount2faWithAuthenticator {\n    __typename\n    ... on Account {\n      id\n      ...TwoFactorAuthenticationFragment\n    }\n    ... on AuthenticatorNotEnabledError {\n      message\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment TwoFactorAuthenticationFragment on Account {\n  has2faEnabled\n  sudoModeExpiresAt\n  twoFactorProviders\n}\n"
  }
};
})();

(node as any).hash = "22f227482e31178545bc6453bdca2f74";

export default node;
