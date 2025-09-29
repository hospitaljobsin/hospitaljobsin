/**
 * @generated SignedSource<<50f88cbf3c30fa8f052e0168d15142b4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LocationPreferencesViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DesktopLocationPreferencesViewFragment" | "MobileLocationPreferencesViewFragment" | "ResumeProgressFragment">;
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

(node as any).hash = "b22a0e9adefe71f892c55084179be328";

export default node;
