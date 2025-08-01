/**
 * @generated SignedSource<<f9cfe3136b319eb5aeee7febbf9f7e73>>
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
  readonly sudoModeExpiresAt: any | null | undefined;
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
    },
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

(node as any).hash = "eb61e0ca8edb3b548a49f15340616a8c";

export default node;
