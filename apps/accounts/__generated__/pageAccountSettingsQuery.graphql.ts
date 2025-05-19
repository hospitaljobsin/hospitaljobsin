/**
 * @generated SignedSource<<b079b85883ec7b569b10d5bfcc1c30d3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageAccountSettingsQuery$variables = Record<PropertyKey, never>;
export type pageAccountSettingsQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"AccountClientComponentFragment">;
};
export type pageAccountSettingsQuery = {
  response: pageAccountSettingsQuery$data;
  variables: pageAccountSettingsQuery$variables;
};

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageAccountSettingsQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "AccountClientComponentFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "pageAccountSettingsQuery",
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
                "name": "email",
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "size",
                    "value": 120
                  }
                ],
                "kind": "ScalarField",
                "name": "avatarUrl",
                "storageKey": "avatarUrl(size:120)"
              },
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
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "authProviders",
                "storageKey": null
              }
            ],
            "type": "Account",
            "abstractKey": null
          },
          {
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "fbaf15a2e39707fd3d0a4dcf8d668beb",
    "id": null,
    "metadata": {},
    "name": "pageAccountSettingsQuery",
    "operationKind": "query",
    "text": "query pageAccountSettingsQuery{...AccountClientComponentFragment}fragment AccountClientComponentFragment on Query{...AccountSettingsViewFragment}fragment AccountDetailsFragment on Account{fullName,email,avatarUrl(size:120)}fragment AccountSettingsViewFragment on Query{viewer{__typename,...on Account{...AccountDetailsFragment,...UpdateAccountDetailsFormFragment,...TwoFactorAuthenticationFragment,...PasswordFragment},...on Node{__isNode:__typename,id}}}fragment PasswordFragment on Account{sudoModeExpiresAt,authProviders,...UpdatePasswordModalFragment}fragment TwoFactorAuthenticationFragment on Account{has2faEnabled,sudoModeExpiresAt,twoFactorProviders}fragment UpdateAccountDetailsFormFragment on Account{fullName,email,avatarUrl(size:120)}fragment UpdatePasswordModalFragment on Account{authProviders}"
  }
};

(node as any).hash = "c72ca15e1c492e386bed888a7aadcbb2";

export default node;
