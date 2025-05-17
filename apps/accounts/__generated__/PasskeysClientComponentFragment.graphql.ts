/**
 * @generated SignedSource<<64e2f90327c2b90856e5e4115c2ccfed>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PasskeysClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"PasskeysSettingsViewFragment">;
  readonly " $fragmentType": "PasskeysClientComponentFragment";
};
export type PasskeysClientComponentFragment$key = {
  readonly " $data"?: PasskeysClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PasskeysClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PasskeysClientComponentFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PasskeysSettingsViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "384c94347cbe2c550588f2223566876e";

export default node;
