/**
 * @generated SignedSource<<216b3ce597af6d75e88d0a3bb6454712>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type AnalyticsPreferenceType = "ACCEPTANCE" | "REJECTION" | "UNDECIDED" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type PrivacySettingsFragment$data = {
  readonly analyticsPreference: {
    readonly type: AnalyticsPreferenceType;
  };
  readonly " $fragmentType": "PrivacySettingsFragment";
};
export type PrivacySettingsFragment$key = {
  readonly " $data"?: PrivacySettingsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PrivacySettingsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PrivacySettingsFragment",
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
};

(node as any).hash = "9f02d9ca0258dd606f3057d9de22b145";

export default node;
