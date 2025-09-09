/**
 * @generated SignedSource<<cb3c29e95f7bb7421c36187f51c9271b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type TrendingJobListFragment$data = {
  readonly viewer: {
    readonly " $fragmentSpreads": FragmentRefs<"JobControlsAuthFragment">;
  };
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

(node as any).hash = "0acbfc151a275c53a76d03c112a8f433";

export default node;
