/**
 * @generated SignedSource<<5810b955b4cc8b8add9a5b945c148022>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SelectViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationListFragment">;
  readonly " $fragmentType": "SelectViewFragment";
};
export type SelectViewFragment$key = {
  readonly " $data"?: SelectViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SelectViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SelectViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "OrganizationListFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "60a7a71fa7715870f0b585d51bb94209";

export default node;
