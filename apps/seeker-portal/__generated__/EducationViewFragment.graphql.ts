/**
 * @generated SignedSource<<70a1bdd08ff27982134d2a2e1e59002e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type EducationViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "DesktopEducationViewFragment" | "MobileEducationViewFragment">;
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

(node as any).hash = "8684d5bd93e4ad752fda1c3e87148dd4";

export default node;
