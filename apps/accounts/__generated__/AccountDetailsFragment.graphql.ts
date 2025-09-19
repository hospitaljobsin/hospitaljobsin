/**
 * @generated SignedSource<<038b7f52702a005c62ed5cc435472d98>>
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
      "args": null,
      "kind": "ScalarField",
      "name": "avatarUrl",
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "ba2aaa0ee1849deb5d4f78d2a59e4e75";

export default node;
