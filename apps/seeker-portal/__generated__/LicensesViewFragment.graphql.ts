/**
 * @generated SignedSource<<bbd4ad14f3c1841e36a3230e1147e6a5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LicensesViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment">;
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
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "f84991266ab5333abd1726a323c57fda";

export default node;
