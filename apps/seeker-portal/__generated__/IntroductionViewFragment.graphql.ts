/**
 * @generated SignedSource<<ec85b12d7f694b879d6fd8f7706b435c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type IntroductionViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DesktopIntroductionViewFragment" | "MobileIntroductionViewFragment">;
  readonly " $fragmentType": "IntroductionViewFragment";
};
export type IntroductionViewFragment$key = {
  readonly " $data"?: IntroductionViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"IntroductionViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "IntroductionViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DesktopIntroductionViewFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MobileIntroductionViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "384550b47082ef4fc8a5dddd6173a2d9";

export default node;
