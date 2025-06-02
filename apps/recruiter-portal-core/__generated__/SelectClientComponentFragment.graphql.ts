/**
 * @generated SignedSource<<5c4d0dc87c7660a840799a39610f4df0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SelectClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"SelectViewFragment">;
  readonly " $fragmentType": "SelectClientComponentFragment";
};
export type SelectClientComponentFragment$key = {
  readonly " $data"?: SelectClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SelectClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SelectClientComponentFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SelectViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "dc920fc10bc724a882ccfc0454aa01fd";

export default node;
