/**
 * @generated SignedSource<<8a1d057b66e061b2a65303d91cd091ef>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type WorkExperienceViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "DesktopWorkExperienceViewFragment" | "MobileWorkExperienceViewFragment" | "ResumeProgressFragment">;
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
      "name": "ResumeProgressFragment"
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

(node as any).hash = "9e0e2a2556b23bde0c73ffdfa6bacee2";

export default node;
