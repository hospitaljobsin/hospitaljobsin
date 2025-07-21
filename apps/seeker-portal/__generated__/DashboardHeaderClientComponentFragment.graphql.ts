/**
 * @generated SignedSource<<62360a945b124556b92b1d41155d62da>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type DashboardHeaderClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment">;
  readonly " $fragmentType": "DashboardHeaderClientComponentFragment";
};
export type DashboardHeaderClientComponentFragment$key = {
  readonly " $data"?: DashboardHeaderClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DashboardHeaderClientComponentFragment",
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

(node as any).hash = "c7d3e48b121402d66837d15d0fc9c773";

export default node;
