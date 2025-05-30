/**
 * @generated SignedSource<<9f3d3abe87e7ad80b1bed7673a1ba40e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SavedJobsViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"SavedJobsListFragment">;
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
      "name": "SavedJobsListFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "3f3ed26f1951bc8784a6731a37bfe69f";

export default node;
