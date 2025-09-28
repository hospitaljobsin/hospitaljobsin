/**
 * @generated SignedSource<<6e1e16e5c14536ea35d8d009a35d03f8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type PersonalInfoViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "DesktopPersonalInfoViewFragment" | "MobilePersonalInfoViewFragment" | "ResumeProgressFragment">;
  readonly " $fragmentType": "PersonalInfoViewFragment";
};
export type PersonalInfoViewFragment$key = {
  readonly " $data"?: PersonalInfoViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PersonalInfoViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PersonalInfoViewFragment",
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
      "name": "DesktopPersonalInfoViewFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MobilePersonalInfoViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "5f85986aab95252faba4fd84983bc408";

export default node;
