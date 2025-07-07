/**
 * @generated SignedSource<<7e759a305aa3ad18614c069f809fe0ff>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobDetailsFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"JobStatisticsFragment">;
  readonly " $fragmentType": "JobDetailsFragment";
};
export type JobDetailsFragment$key = {
  readonly " $data"?: JobDetailsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobDetailsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobDetailsFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "JobStatisticsFragment"
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "78db2c95ca358fd7ab2cd5a99847ff70";

export default node;
