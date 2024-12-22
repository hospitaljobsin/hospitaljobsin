/**
 * @generated SignedSource<<9bd3532fd49587526d50787f8dfa599f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type JobControlsFragment$data = {
  readonly id: string;
  readonly isSaved: boolean;
  readonly slug: string;
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
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

(node as any).hash = "42b329357b3a7b71f643c74d0426ca90";

export default node;
