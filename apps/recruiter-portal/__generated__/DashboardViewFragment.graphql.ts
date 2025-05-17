/**
 * @generated SignedSource<<47484bb2723df88a3154f96b056990db>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DashboardViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationListFragment">;
  readonly " $fragmentType": "DashboardViewFragment";
};
export type DashboardViewFragment$key = {
  readonly " $data"?: DashboardViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DashboardViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DashboardViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "OrganizationListFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "0bd929b7168abd4d5e092deb452a6d28";

export default node;
