/**
 * @generated SignedSource<<f9970389fca0453c2d7c23ca9ee3b5a8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SavedJobsViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"MyJobsHeaderFragment" | "SavedJobsListFragment">;
  readonly " $fragmentType": "SavedJobsViewFragment";
};
export type SavedJobsViewFragment$key = {
  readonly " $data"?: SavedJobsViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SavedJobsViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SavedJobsViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyJobsHeaderFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SavedJobsListFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "08d8b40336f3391c78d8f52e58addca9";

export default node;
