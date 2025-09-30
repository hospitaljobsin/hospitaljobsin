/**
 * @generated SignedSource<<de0dc47992e95ee88d467146f9b80ae9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ResumeViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DesktopResumeViewFragment" | "MobileResumeViewFragment">;
  readonly " $fragmentType": "ResumeViewFragment";
};
export type ResumeViewFragment$key = {
  readonly " $data"?: ResumeViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ResumeViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ResumeViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DesktopResumeViewFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MobileResumeViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "17be9d379fbd5399a2439572de254a45";

export default node;
