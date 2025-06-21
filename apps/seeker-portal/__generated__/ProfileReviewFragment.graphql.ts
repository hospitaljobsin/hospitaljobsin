/**
 * @generated SignedSource<<8c311f1102637baa08c22c2ce3d687b6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ProfileReviewFragment$data = {
  readonly __typename: "Account";
  readonly " $fragmentType": "ProfileReviewFragment";
};
export type ProfileReviewFragment$key = {
  readonly " $data"?: ProfileReviewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProfileReviewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProfileReviewFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "e321211f7133d264c8f2c8ff9290279b";

export default node;
