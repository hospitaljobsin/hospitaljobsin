/**
 * @generated SignedSource<<2bd2428c5a4463be79a2057d487b8c02>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SavedJobsClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"SavedJobsViewFragment">;
  readonly " $fragmentType": "SavedJobsClientComponentFragment";
};
export type SavedJobsClientComponentFragment$key = {
  readonly " $data"?: SavedJobsClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SavedJobsClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SavedJobsClientComponentFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SavedJobsViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "3458f9896c47c6e472e575db3fffdd00";

export default node;
