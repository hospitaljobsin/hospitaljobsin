/**
 * @generated SignedSource<<551d5e796b505bdc846389195a6e244d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type SessionAccountSudoFragment$data = {
  readonly sudoModeExpiresAt: any | null | undefined;
  readonly " $fragmentType": "SessionAccountSudoFragment";
};
export type SessionAccountSudoFragment$key = {
  readonly " $data"?: SessionAccountSudoFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SessionAccountSudoFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SessionAccountSudoFragment",
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

(node as any).hash = "06d96cc1970aaa8abf702d4c51b98cc2";

export default node;
