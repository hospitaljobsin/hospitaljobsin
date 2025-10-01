/**
 * @generated SignedSource<<85eae971ec50e00ee9bf6920d9934342>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LanguagesViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DesktopLanguagesViewFragment" | "MobileLanguagesViewFragment">;
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

(node as any).hash = "6dacadac6fd5c77afb004a1047cdc1fd";

export default node;
