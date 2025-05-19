/**
 * @generated SignedSource<<6b7638bebc3b5ee3b7e8fd311a6a2b45>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobControlsFragment$data = {
  readonly id: string;
  readonly isSaved: boolean;
  readonly " $fragmentSpreads": FragmentRefs<"ShareJobFragment">;
  readonly " $fragmentType": "JobControlsFragment";
};
export type JobControlsFragment$key = {
  readonly " $data"?: JobControlsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobControlsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobControlsFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isSaved",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShareJobFragment"
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "671b571915089890718dc015f2102fd2";

export default node;
