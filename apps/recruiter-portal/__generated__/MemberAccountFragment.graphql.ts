/**
 * @generated SignedSource<<763cd25665bfa4108a51bab49cf6c3cc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type MemberAccountFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"MemberControlsAccountFragment">;
  readonly " $fragmentType": "MemberAccountFragment";
};
export type MemberAccountFragment$key = {
  readonly " $data"?: MemberAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MemberAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MemberAccountFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MemberControlsAccountFragment"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "21676df6faac89ece04f53f100d803dd";

export default node;
