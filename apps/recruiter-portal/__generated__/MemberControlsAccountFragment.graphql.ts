/**
 * @generated SignedSource<<0678fb8464d443571049362fcb9622c6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type MemberControlsAccountFragment$data = {
  readonly sudoModeExpiresAt: any | null | undefined;
  readonly " $fragmentType": "MemberControlsAccountFragment";
};
export type MemberControlsAccountFragment$key = {
  readonly " $data"?: MemberControlsAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MemberControlsAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MemberControlsAccountFragment",
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

(node as any).hash = "7eecc2819ceea4a331f3ecc1de684150";

export default node;
