/**
 * @generated SignedSource<<4aaa8fdb9e21d8da1c378963b6fbe569>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AdditionalViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment">;
  readonly " $fragmentType": "AdditionalViewFragment";
};
export type AdditionalViewFragment$key = {
  readonly " $data"?: AdditionalViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AdditionalViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AdditionalViewFragment",
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

(node as any).hash = "a2bed1752b59d0883a19641c380da67a";

export default node;
