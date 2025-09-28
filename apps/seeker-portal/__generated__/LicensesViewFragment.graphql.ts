/**
 * @generated SignedSource<<6344f8294e1e71f9ac54723a36c1b0dc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LicensesViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "DesktopLicensesViewFragment" | "MobileLicensesViewFragment">;
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
      "name": "DashboardHeaderFragment"
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

(node as any).hash = "68b4f39cf2a2ccb23bdae7ddf3c5c21a";

export default node;
