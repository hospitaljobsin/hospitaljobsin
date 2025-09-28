/**
 * @generated SignedSource<<036c9318da8369135fd36c2afa59de9d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LocationPreferencesViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "DesktopLocationPreferencesViewFragment" | "MobileLocationPreferencesViewFragment" | "ResumeProgressFragment">;
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
      "name": "ResumeProgressFragment"
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

(node as any).hash = "843d9e965ac3fc17776d27f410e48959";

export default node;
