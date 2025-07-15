/**
 * @generated SignedSource<<393f2dc0c0591698e49b875c091efbe3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LandingViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"JobListFragment" | "LandingHeaderFragment">;
  readonly " $fragmentType": "LandingViewFragment";
};
export type LandingViewFragment$key = {
  readonly " $data"?: LandingViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LandingViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LandingViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "JobListFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "LandingHeaderFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "87bcb89582ef2f077fb9a1bf0e67c4ac";

export default node;
