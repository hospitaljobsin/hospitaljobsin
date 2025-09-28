/**
 * @generated SignedSource<<a8c68f304d90472c786d6f2c08fa0e31>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LicensesViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "DesktopLicensesViewFragment" | "MobileLicensesViewFragment" | "ResumeProgressFragment">;
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

(node as any).hash = "dca588ef95a814cfca32de81b38ce9c7";

export default node;
