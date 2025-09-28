/**
 * @generated SignedSource<<bbf902c5d5cf87055089721810ddab9e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type PersonalInfoViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "DesktopPersonalInfoViewFragment" | "MobilePersonalInfoViewFragment">;
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

(node as any).hash = "a3b676ce3659b16d648e1ff18b94f3f3";

export default node;
