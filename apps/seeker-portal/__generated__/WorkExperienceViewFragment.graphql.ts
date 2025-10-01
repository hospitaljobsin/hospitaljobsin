/**
 * @generated SignedSource<<3615fbccaa185d792805ca5a637345c9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type WorkExperienceViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DesktopWorkExperienceViewFragment" | "MobileWorkExperienceViewFragment" | "ResumeProgressFragment">;
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

(node as any).hash = "2e4b15e2050a8c37a333d31ddf81129b";

export default node;
