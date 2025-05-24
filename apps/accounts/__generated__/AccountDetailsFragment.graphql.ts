/**
 * @generated SignedSource<<bdb26249f73a34e7ae5916d71e222b55>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AccountDetailsFragment$data = {
  readonly avatarUrl: string;
  readonly email: string;
  readonly fullName: string;
  readonly " $fragmentType": "AccountDetailsFragment";
};
export type AccountDetailsFragment$key = {
  readonly " $data"?: AccountDetailsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AccountDetailsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AccountDetailsFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "fullName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 120
        }
      ],
      "kind": "ScalarField",
      "name": "avatarUrl",
      "storageKey": "avatarUrl(size:120)"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "a571a3765285d0d58a0b0b35ddff9251";

export default node;
