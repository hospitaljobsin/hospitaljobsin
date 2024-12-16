/**
 * @generated SignedSource<<4a91321b3a4f85c20b229fda79ec5574>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProfileHeaderFragment$data = {
  readonly email: string;
  readonly fullName: string;
  readonly " $fragmentType": "ProfileHeaderFragment";
};
export type ProfileHeaderFragment$key = {
  readonly " $data"?: ProfileHeaderFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProfileHeaderFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProfileHeaderFragment",
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
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "e0857a237bc75d62e9e9bbf31c18f28a";

export default node;
