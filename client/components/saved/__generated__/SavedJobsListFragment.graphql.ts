/**
 * @generated SignedSource<<ef65204a4c7ec2a053557a8d90033b40>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SavedJobsListFragment$data = {
  readonly viewer: {
    readonly " $fragmentSpreads": FragmentRefs<"JobControlsAuthFragment">;
  };
  readonly " $fragmentSpreads": FragmentRefs<"SavedJobsListInternalFragment">;
  readonly " $fragmentType": "SavedJobsListFragment";
};
export type SavedJobsListFragment$key = {
  readonly " $data"?: SavedJobsListFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SavedJobsListFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SavedJobsListFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SavedJobsListInternalFragment"
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

(node as any).hash = "656df226c3364364cb3d22c774b5a779";

export default node;
