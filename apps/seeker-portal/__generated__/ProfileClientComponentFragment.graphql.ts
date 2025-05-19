/**
 * @generated SignedSource<<66fa028087c5a90cd66e951ff3321899>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ProfileClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ProfileViewFragment">;
  readonly " $fragmentType": "ProfileClientComponentFragment";
};
export type ProfileClientComponentFragment$key = {
  readonly " $data"?: ProfileClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProfileClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProfileClientComponentFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ProfileViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "0974216e52284d83307696a71e7b8aee";

export default node;
