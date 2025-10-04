/**
 * @generated SignedSource<<4d5f027ea3e03379db8df483695fbce5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type MyJobAlertsViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "JobAlertsListFragment" | "RecommendedJobAlertsFragment" | "SetWhatsappAlertsFragment">;
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "RecommendedJobAlertsFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "7a8ebd5fae76b4b72763c30c810a8c81";

export default node;
