/**
 * @generated SignedSource<<07b5f6f0fe25339a2b2ed9e5776a52a9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AppliedJobsViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"AppliedJobsListFragment" | "MyJobsHeaderFragment">;
  readonly " $fragmentType": "AppliedJobsViewFragment";
};
export type AppliedJobsViewFragment$key = {
  readonly " $data"?: AppliedJobsViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AppliedJobsViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AppliedJobsViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyJobsHeaderFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "AppliedJobsListFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "2add5e67e72d5693bc77d1fb3aae59b5";

export default node;
