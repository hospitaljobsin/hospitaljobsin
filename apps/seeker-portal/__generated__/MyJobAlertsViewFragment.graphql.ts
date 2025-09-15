/**
 * @generated SignedSource<<d6b820b5e2cbf6cef0cf496b73a808ba>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type MyJobAlertsViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment">;
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
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "008ac280013726b17636332741e8779a";

export default node;
