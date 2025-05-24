/**
 * @generated SignedSource<<3bd1289f281b39f30da66983cb099245>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
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
