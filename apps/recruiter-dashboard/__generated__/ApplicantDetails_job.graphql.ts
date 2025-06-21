/**
 * @generated SignedSource<<24f0e77d8e16dd6494f6769ebcca02ce>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ApplicantDetails_job$data = {
  readonly id: string;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantStatusUpdater_job">;
  readonly " $fragmentType": "ApplicantDetails_job";
};
export type ApplicantDetails_job$key = {
  readonly " $data"?: ApplicantDetails_job$data;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantDetails_job">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ApplicantDetails_job",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ApplicantStatusUpdater_job"
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "d4367eb3130e81691464560aa5ee28ca";

export default node;
