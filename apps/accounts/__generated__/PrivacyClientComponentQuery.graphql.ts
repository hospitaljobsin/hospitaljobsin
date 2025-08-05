/**
 * @generated SignedSource<<a027bbf8ec8fa536eae65482aace5489>>
 * @relayHash a699302784a0f7af4b6719fbf8ac82ca
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID a699302784a0f7af4b6719fbf8ac82ca

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type PrivacyClientComponentQuery$variables = Record<PropertyKey, never>;
export type PrivacyClientComponentQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"PrivacySettingsViewFragment">;
};
export type PrivacyClientComponentQuery = {
  response: PrivacyClientComponentQuery$data;
  variables: PrivacyClientComponentQuery$variables;
};

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PrivacyClientComponentQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "PrivacySettingsViewFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PrivacyClientComponentQuery",
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
    "id": "a699302784a0f7af4b6719fbf8ac82ca",
    "metadata": {},
    "name": "PrivacyClientComponentQuery",
    "operationKind": "query",
    "text": null
  }
};

(node as any).hash = "b29f30dea00e0137d9d49fba50285d8a";

export default node;
