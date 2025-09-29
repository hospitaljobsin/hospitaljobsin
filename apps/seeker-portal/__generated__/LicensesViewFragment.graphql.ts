/**
 * @generated SignedSource<<9351de3d00b2d39d2924d83d4469db19>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LicensesViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DesktopLicensesViewFragment" | "MobileLicensesViewFragment">;
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

(node as any).hash = "d4f34f3653cdb26cc3ba3458f117f583";

export default node;
