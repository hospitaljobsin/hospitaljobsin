/**
 * @generated SignedSource<<3731145fd4a43d605a6d9cfba84cd17d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type PhoneNumberFragment$data = {
  readonly phoneNumber: string | null | undefined;
  readonly " $fragmentType": "PhoneNumberFragment";
};
export type PhoneNumberFragment$key = {
  readonly " $data"?: PhoneNumberFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PhoneNumberFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PhoneNumberFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "phoneNumber",
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "d486155cce555cf6ff760f00a1398e1d";

export default node;
