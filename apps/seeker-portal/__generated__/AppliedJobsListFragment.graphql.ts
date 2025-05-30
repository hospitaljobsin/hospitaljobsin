/**
 * @generated SignedSource<<d3d845c61fad93f091cd1de5db1c0f6c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AppliedJobsListFragment$data = {
  readonly viewer: {
    readonly " $fragmentSpreads": FragmentRefs<"JobControlsAuthFragment">;
  };
  readonly " $fragmentSpreads": FragmentRefs<"AppliedJobsListInternalFragment">;
  readonly " $fragmentType": "AppliedJobsListFragment";
};
export type AppliedJobsListFragment$key = {
  readonly " $data"?: AppliedJobsListFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AppliedJobsListFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AppliedJobsListFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "AppliedJobsListInternalFragment"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "viewer",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "JobControlsAuthFragment"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "4643a4b7b37fd9713ff96f2694fe1e08";

export default node;
