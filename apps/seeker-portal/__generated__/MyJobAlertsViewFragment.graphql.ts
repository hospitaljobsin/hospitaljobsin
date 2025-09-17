/**
 * @generated SignedSource<<05a92ccf430904a90958512daadcbac0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type MyJobAlertsViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "EnableWhatsappAlertsFragment" | "JobAlertsListFragment">;
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
      "name": "EnableWhatsappAlertsFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "348d2c35aded9286b1263978dd057fc7";

export default node;
