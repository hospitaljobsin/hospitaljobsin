/**
 * @generated SignedSource<<2d93f72bdfd89e31c526ca1d39165179>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type PendingVerificationViewFragment$data = {
  readonly __typename: "Organization";
  readonly name: string;
  readonly " $fragmentType": "PendingVerificationViewFragment";
};
export type PendingVerificationViewFragment$key = {
  readonly " $data"?: PendingVerificationViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PendingVerificationViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PendingVerificationViewFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "cf3952eb49002367a3a94d516f3dddf3";

export default node;
