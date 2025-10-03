/**
 * @generated SignedSource<<8b0ca145677d9ecc2f3224e071313a52>>
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
  readonly " $fragmentSpreads": FragmentRefs<"ShareJobModalFragment">;
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
      "name": "ShareJobModalFragment"
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "856348af546bb94c88706f01489da1c6";

export default node;
