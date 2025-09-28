/**
 * @generated SignedSource<<a920eeaddd15f4d82c38f656ae4f73fe>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type WorkExperienceViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "DesktopWorkExperienceViewFragment" | "MobileWorkExperienceViewFragment">;
  readonly " $fragmentType": "WorkExperienceViewFragment";
};
export type WorkExperienceViewFragment$key = {
  readonly " $data"?: WorkExperienceViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"WorkExperienceViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkExperienceViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DashboardHeaderFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DesktopWorkExperienceViewFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MobileWorkExperienceViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "29155923dace327e923c753778430fca";

export default node;
