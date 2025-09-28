/**
 * @generated SignedSource<<5380d16f0ffff46c783d9e2448c1896b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LocationPreferencesViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment">;
  readonly " $fragmentType": "LocationPreferencesViewFragment";
};
export type LocationPreferencesViewFragment$key = {
  readonly " $data"?: LocationPreferencesViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LocationPreferencesViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LocationPreferencesViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DashboardHeaderFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "7b2131d8c2fc2068634c73c6850d541c";

export default node;
