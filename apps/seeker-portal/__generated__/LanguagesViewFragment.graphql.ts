/**
 * @generated SignedSource<<2fa9d0fe03b76e8b355509ae7e5e26b3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LanguagesViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DesktopLanguagesViewFragment" | "MobileLanguagesViewFragment" | "ResumeProgressFragment">;
  readonly " $fragmentType": "LanguagesViewFragment";
};
export type LanguagesViewFragment$key = {
  readonly " $data"?: LanguagesViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LanguagesViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LanguagesViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ResumeProgressFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DesktopLanguagesViewFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MobileLanguagesViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "1ad4dc1161404c1bdb7043b61820e156";

export default node;
