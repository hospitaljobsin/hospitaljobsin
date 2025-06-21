/**
 * @generated SignedSource<<cbf8e6fa873cace6ec8ad55917642ee1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ApplicantStatusUpdater_job$data = {
  readonly id: string;
  readonly " $fragmentType": "ApplicantStatusUpdater_job";
};
export type ApplicantStatusUpdater_job$key = {
  readonly " $data"?: ApplicantStatusUpdater_job$data;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantStatusUpdater_job">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ApplicantStatusUpdater_job",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "4cded3f126313a2ee21a1ff3b10d3939";

export default node;
