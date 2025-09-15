/**
 * @generated SignedSource<<4d59b83881c5d6a6e6cfcca2d69f36f6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type MyJobAlertsViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "JobAlertsListFragment">;
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
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "3a245e8341255d50ae1a5596b9b67813";

export default node;
