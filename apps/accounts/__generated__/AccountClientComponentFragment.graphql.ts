/**
 * @generated SignedSource<<3d44ead673e8cffa602cf538e0b51cc0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AccountClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"AccountSettingsViewFragment">;
  readonly " $fragmentType": "AccountClientComponentFragment";
};
export type AccountClientComponentFragment$key = {
  readonly " $data"?: AccountClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AccountClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AccountClientComponentFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "AccountSettingsViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "740d0c484c7ffa9fd0c4a6e75332faec";

export default node;
