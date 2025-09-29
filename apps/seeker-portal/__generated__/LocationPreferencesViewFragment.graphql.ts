/**
 * @generated SignedSource<<bb8e8b2c84e6b69403a782ae89691cda>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LocationPreferencesViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DesktopLocationPreferencesViewFragment" | "MobileLocationPreferencesViewFragment">;
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

(node as any).hash = "2642081bd02471a30c2e3cc6217a5c41";

export default node;
