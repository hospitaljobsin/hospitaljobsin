/**
 * @generated SignedSource<<ec89c63fa030f12d97f9cba3f56da44e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
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
    "cacheID": "830927f442c4227743a2ebf4310990ba",
    "id": null,
    "metadata": {},
    "name": "DisableAuthenticator2FAModalMutation",
    "operationKind": "mutation",
    "text": "mutation DisableAuthenticator2FAModalMutation{disableAccount2faWithAuthenticator{__typename,...on Account{id,...TwoFactorAuthenticationFragment},...on AuthenticatorNotEnabledError{message},...on Node{__isNode:__typename,id}}}fragment TwoFactorAuthenticationFragment on Account{has2faEnabled,sudoModeExpiresAt,twoFactorProviders}"
  }
};
})();

(node as any).hash = "22f227482e31178545bc6453bdca2f74";

export default node;
