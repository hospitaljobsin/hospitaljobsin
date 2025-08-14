/**
 * @generated SignedSource<<1fe74ffa18474eb6f11beff8b692a7c3>>
 * @relayHash 8382e670ff9dc17dd50beec1881e2559
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 8382e670ff9dc17dd50beec1881e2559

import type { ConcreteRequest } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AnalyticsPreferenceInputType = "ACCEPTANCE" | "REJECTION" | "%future added value";
export type AnalyticsPreferenceType = "ACCEPTANCE" | "REJECTION" | "UNDECIDED" | "%future added value";
export type PrivacySettingsUpdateAccountAnalyticsPreferenceMutation$variables = {
  analyticsPreference: AnalyticsPreferenceInputType;
};
export type PrivacySettingsUpdateAccountAnalyticsPreferenceMutation$data = {
  readonly updateAccountAnalyticsPreference: {
    readonly analyticsPreference: {
      readonly type: AnalyticsPreferenceType;
    };
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"PrivacySettingsFragment">;
  } | null | undefined;
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
  "name": "id",
  "storageKey": null
},
v3 = {
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
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "updateAccountAnalyticsPreference",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "PrivacySettingsFragment"
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
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "updateAccountAnalyticsPreference",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "8382e670ff9dc17dd50beec1881e2559",
    "metadata": {},
    "name": "PrivacySettingsUpdateAccountAnalyticsPreferenceMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "7e3b73fa3e68ed9a07e07eb8dee57078";

export default node;
