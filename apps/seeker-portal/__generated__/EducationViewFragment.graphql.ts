/**
 * @generated SignedSource<<31aef002285e883f48591a6fe9105ab6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type EducationViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment">;
  readonly " $fragmentType": "EducationViewFragment";
};
export type EducationViewFragment$key = {
  readonly " $data"?: EducationViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"EducationViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EducationViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DashboardHeaderFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "b45ebbcef48eba80e800d3ac90ade818";

export default node;
