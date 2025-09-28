/**
 * @generated SignedSource<<7f73ed796d70cf7a348ad09cd76a601f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type EducationViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "DesktopEducationViewFragment" | "MobileEducationViewFragment" | "ResumeProgressFragment">;
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ResumeProgressFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DesktopEducationViewFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MobileEducationViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "8fa5236af06040d69e299ba6a4816d98";

export default node;
