/**
 * @generated SignedSource<<aa0f19fedab12ae9670e198e8636a8d2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type PersonalInfoViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DesktopPersonalInfoViewFragment" | "MobilePersonalInfoViewFragment" | "ResumeProgressFragment">;
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

(node as any).hash = "19f4c818f3b1eb09ecf3d9a211497213";

export default node;
