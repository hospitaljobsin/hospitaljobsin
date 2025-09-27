/**
 * @generated SignedSource<<41cab1ee07a1485da0a27b04d639ce5f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SummaryViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment">;
  readonly " $fragmentType": "SummaryViewFragment";
};
export type SummaryViewFragment$key = {
  readonly " $data"?: SummaryViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SummaryViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SummaryViewFragment",
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

(node as any).hash = "0b3a560c9b9da30500315abdfa57e11d";

export default node;
