/**
 * @generated SignedSource<<940e47e20fc7e8ee74e375c6af1012a2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LicensesViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DesktopLicensesViewFragment" | "MobileLicensesViewFragment" | "ResumeProgressFragment">;
  readonly " $fragmentType": "LicensesViewFragment";
};
export type LicensesViewFragment$key = {
  readonly " $data"?: LicensesViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LicensesViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LicensesViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ResumeProgressFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DesktopLicensesViewFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MobileLicensesViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "6ef3d7e9e5072a0c52ec356f057051ea";

export default node;
