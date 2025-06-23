/**
 * @generated SignedSource<<6220b0ef253d805927656e96bb7518a9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ApplicantListControllerFragment$data = {
  readonly id: string;
  readonly " $fragmentType": "ApplicantListControllerFragment";
};
export type ApplicantListControllerFragment$key = {
  readonly " $data"?: ApplicantListControllerFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantListControllerFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ApplicantListControllerFragment",
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

(node as any).hash = "ee87b72668041bc4a2fcaa9b6320fb3c";

export default node;
