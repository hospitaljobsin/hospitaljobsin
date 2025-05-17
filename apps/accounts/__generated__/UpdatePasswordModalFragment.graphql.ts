/**
 * @generated SignedSource<<dd850c3191ab9ce344458cbe72608b00>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type AuthProvider = "OAUTH_GOOGLE" | "PASSWORD" | "WEBAUTHN_CREDENTIAL" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type UpdatePasswordModalFragment$data = {
  readonly authProviders: ReadonlyArray<AuthProvider>;
  readonly " $fragmentType": "UpdatePasswordModalFragment";
};
export type UpdatePasswordModalFragment$key = {
  readonly " $data"?: UpdatePasswordModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdatePasswordModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdatePasswordModalFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "authProviders",
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "3e075d9ebd984d83be2f92b50787e0cc";

export default node;
