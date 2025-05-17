/**
 * @generated SignedSource<<c43cf1fd9bdbf1677080089de8fc4e96>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
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
    "cacheID": "487a9c92eaf4b513771c1f5f6e14a96b",
    "id": null,
    "metadata": {},
    "name": "pageAccountSettingsQuery",
    "operationKind": "query",
    "text": "query pageAccountSettingsQuery {\n  ...AccountClientComponentFragment\n}\n\nfragment AccountClientComponentFragment on Query {\n  ...AccountSettingsViewFragment\n}\n\nfragment AccountDetailsFragment on Account {\n  fullName\n  email\n  avatarUrl(size: 120)\n}\n\nfragment AccountSettingsViewFragment on Query {\n  viewer {\n    __typename\n    ... on Account {\n      ...AccountDetailsFragment\n      ...UpdateAccountDetailsFormFragment\n      ...TwoFactorAuthenticationFragment\n      ...PasswordFragment\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment PasswordFragment on Account {\n  sudoModeExpiresAt\n  authProviders\n  ...UpdatePasswordModalFragment\n}\n\nfragment TwoFactorAuthenticationFragment on Account {\n  has2faEnabled\n  sudoModeExpiresAt\n  twoFactorProviders\n}\n\nfragment UpdateAccountDetailsFormFragment on Account {\n  fullName\n  email\n  avatarUrl(size: 120)\n}\n\nfragment UpdatePasswordModalFragment on Account {\n  authProviders\n}\n"
  }
};

(node as any).hash = "c72ca15e1c492e386bed888a7aadcbb2";

export default node;
