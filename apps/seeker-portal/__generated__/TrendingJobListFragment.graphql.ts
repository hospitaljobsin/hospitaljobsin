/**
 * @generated SignedSource<<e108eba09666581a487f9caf45d76dab>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type TrendingJobListFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"TrendingJobListInternalFragment">;
  readonly " $fragmentType": "TrendingJobListFragment";
};
export type TrendingJobListFragment$key = {
  readonly " $data"?: TrendingJobListFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"TrendingJobListFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TrendingJobListFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "TrendingJobListInternalFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "79025a6a50b72dc9f3975dd7c75c0a9e";

export default node;
