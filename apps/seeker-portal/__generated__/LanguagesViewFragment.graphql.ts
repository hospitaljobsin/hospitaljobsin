/**
 * @generated SignedSource<<6251de5a4a524ffcd227d2f589d54de1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LanguagesViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment">;
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
      "name": "DashboardHeaderFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "5024da921c05c255b9ac36f00051165d";

export default node;
