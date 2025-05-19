/**
 * @generated SignedSource<<33f801cef0cc100331aa536c7dea7f2b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type DashboardClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardViewFragment">;
  readonly " $fragmentType": "DashboardClientComponentFragment";
};
export type DashboardClientComponentFragment$key = {
  readonly " $data"?: DashboardClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DashboardClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DashboardClientComponentFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DashboardViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "4f3e4982f78889d6d36f443e3bddc80e";

export default node;
