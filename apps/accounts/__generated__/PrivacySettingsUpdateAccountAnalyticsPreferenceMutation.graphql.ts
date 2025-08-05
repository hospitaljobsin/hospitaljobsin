/**
 * @generated SignedSource<<79e7d294fbfb81da58b04d7471c74ccd>>
 * @relayHash c0b576d597175d5924d4c44529cf2361
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c0b576d597175d5924d4c44529cf2361

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AnalyticsPreferenceInputType = "ACCEPTANCE" | "REJECTION" | "%future added value";
export type AnalyticsPreferenceType = "ACCEPTANCE" | "REJECTION" | "UNDECIDED" | "%future added value";
export type PrivacySettingsUpdateAccountAnalyticsPreferenceMutation$variables = {
  analyticsPreference: AnalyticsPreferenceInputType;
};
export type PrivacySettingsUpdateAccountAnalyticsPreferenceMutation$data = {
  readonly updateAccountAnalyticsPreference: {
    readonly __typename: "Account";
    readonly analyticsPreference: {
      readonly type: AnalyticsPreferenceType;
    };
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"PrivacySettingsFragment">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
};
export type PrivacySettingsUpdateAccountAnalyticsPreferenceMutation = {
  response: PrivacySettingsUpdateAccountAnalyticsPreferenceMutation$data;
  variables: PrivacySettingsUpdateAccountAnalyticsPreferenceMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "analyticsPreference"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "analyticsPreference",
    "variableName": "analyticsPreference"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PrivacySettingsUpdateAccountAnalyticsPreferenceMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateAccountAnalyticsPreference",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "PrivacySettingsFragment"
              }
            ],
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PrivacySettingsUpdateAccountAnalyticsPreferenceMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "updateAccountAnalyticsPreference",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "type": "Account",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/)
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
    "id": "c0b576d597175d5924d4c44529cf2361",
    "metadata": {},
    "name": "PrivacySettingsUpdateAccountAnalyticsPreferenceMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "31627a5d947cc9b3a365cadefce6b5c4";

export default node;
