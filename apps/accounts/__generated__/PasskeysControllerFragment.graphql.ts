/**
 * @generated SignedSource<<428f3b1acee8d5982c58d6592e5f384d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PasskeysControllerFragment$data = {
  readonly sudoModeExpiresAt: any | null | undefined;
  readonly " $fragmentType": "PasskeysControllerFragment";
};
export type PasskeysControllerFragment$key = {
  readonly " $data"?: PasskeysControllerFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PasskeysControllerFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PasskeysControllerFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sudoModeExpiresAt",
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "71339b88411a2e3f71b55ffcc0774200";

export default node;
