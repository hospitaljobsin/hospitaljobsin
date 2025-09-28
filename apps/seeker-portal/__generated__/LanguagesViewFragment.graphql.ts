/**
 * @generated SignedSource<<ff68f975c1a1df5e97db1aba56242632>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LanguagesViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "DesktopLanguagesViewFragment" | "MobileLanguagesViewFragment">;
  readonly " $fragmentType": "LanguagesViewFragment";
};
export type LanguagesViewFragment$key = {
  readonly " $data"?: LanguagesViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LanguagesViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LanguagesViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DashboardHeaderFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DesktopLanguagesViewFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MobileLanguagesViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "83e6c22e4d9d6e673d15fe833e930b74";

export default node;
