/**
 * @generated SignedSource<<e5b17c860c516296b38d61f360f0707b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrganizationTabsFragment$data = {
  readonly isAdmin: boolean;
  readonly " $fragmentType": "OrganizationTabsFragment";
};
export type OrganizationTabsFragment$key = {
  readonly " $data"?: OrganizationTabsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationTabsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationTabsFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isAdmin",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "ec8b337752662779f3e2d7a5c11608fb";

export default node;
