/**
 * @generated SignedSource<<663bbc1fb1927c473748a113224aa19f>>
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
  readonly isActive: boolean;
  readonly " $fragmentSpreads": FragmentRefs<"PublishJobModalFragment" | "UnpublishJobModalFragment">;
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
      "name": "isActive",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "UnpublishJobModalFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PublishJobModalFragment"
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "75e4759160ed42813f3836c25664da0e";

export default node;
