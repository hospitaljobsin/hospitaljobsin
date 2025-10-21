/**
 * @generated SignedSource<<020e36a1ab81f53441a8942c11ce8807>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationsViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationsGridFragment">;
  readonly " $fragmentType": "OrganizationsViewFragment";
};
export type OrganizationsViewFragment$key = {
  readonly " $data"?: OrganizationsViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationsViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationsViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "OrganizationsGridFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "7f48231164db3c282d06ea61beeea595";

export default node;
