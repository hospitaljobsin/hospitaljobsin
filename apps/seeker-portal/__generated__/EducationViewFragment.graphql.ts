/**
 * @generated SignedSource<<61c839fc2b6826c3b9405fd4d978d6f7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type EducationViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DesktopEducationViewFragment" | "MobileEducationViewFragment">;
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

(node as any).hash = "ef3673fbf9fd1f89abe2280dc701152f";

export default node;
