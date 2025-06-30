/**
 * @generated SignedSource<<f0df30f83527965c50a7a90030bfbada>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobTabsFragment$data = {
  readonly externalApplicationUrl: string | null | undefined;
  readonly " $fragmentType": "JobTabsFragment";
};
export type JobTabsFragment$key = {
  readonly " $data"?: JobTabsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobTabsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobTabsFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "externalApplicationUrl",
      "storageKey": null
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "839a97b4a1be3d5f01bff41a964a3614";

export default node;
