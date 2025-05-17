/**
 * @generated SignedSource<<01de5b0bffc846e68da4ad80744a4624>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DeletePasskeyModalFragment$data = {
  readonly id: string;
  readonly " $fragmentType": "DeletePasskeyModalFragment";
};
export type DeletePasskeyModalFragment$key = {
  readonly " $data"?: DeletePasskeyModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DeletePasskeyModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DeletePasskeyModalFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "WebAuthnCredential",
  "abstractKey": null
};

(node as any).hash = "46592e6877a9a80f014b1616d4bb0212";

export default node;
