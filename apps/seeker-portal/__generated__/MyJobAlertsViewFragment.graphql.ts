/**
 * @generated SignedSource<<382c2a1bceb0228950f33ad9f274bb29>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type MyJobAlertsViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "JobAlertsListFragment" | "SetWhatsappAlertsFragment">;
  readonly " $fragmentType": "MyJobAlertsViewFragment";
};
export type MyJobAlertsViewFragment$key = {
  readonly " $data"?: MyJobAlertsViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MyJobAlertsViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyJobAlertsViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DashboardHeaderFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "JobAlertsListFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SetWhatsappAlertsFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "0c6887f750e1803748b8374dbca738e2";

export default node;
