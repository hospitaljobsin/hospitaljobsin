/**
 * @generated SignedSource<<8b97885d9cd513b27a94991d697c01cd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LocationPreferencesViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "DesktopLocationPreferencesViewFragment" | "MobileLocationPreferencesViewFragment">;
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DesktopLocationPreferencesViewFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MobileLocationPreferencesViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "f2993c9ae80d5545bc048e9ee6975e8c";

export default node;
