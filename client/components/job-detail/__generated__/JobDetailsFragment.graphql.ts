/**
 * @generated SignedSource<<8843c080559919fa112657fc765d3a56>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type JobDetailsFragment$data = {
  readonly description: string;
  readonly title: string;
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "c6a3d4a42dc3f5e2b188c09d633e0a33";

export default node;
