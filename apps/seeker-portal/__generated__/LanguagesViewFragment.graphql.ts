/**
 * @generated SignedSource<<6140f5f294e0fce931005ad2f4849a86>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LanguagesViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "DesktopLanguagesViewFragment" | "MobileLanguagesViewFragment" | "ResumeProgressFragment">;
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
      "name": "ResumeProgressFragment"
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

(node as any).hash = "ba54dec3b5ed0dcec16dc9fdfab155fe";

export default node;
