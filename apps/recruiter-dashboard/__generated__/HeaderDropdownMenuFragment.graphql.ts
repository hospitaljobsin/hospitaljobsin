/**
 * @generated SignedSource<<0e2c75e31014bde1a6debb6f043ce465>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type HeaderDropdownMenuFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationSwitcherListFragment">;
  readonly " $fragmentType": "HeaderDropdownMenuFragment";
};
export type HeaderDropdownMenuFragment$key = {
  readonly " $data"?: HeaderDropdownMenuFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"HeaderDropdownMenuFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "HeaderDropdownMenuFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "OrganizationSwitcherListFragment"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "11a02d275a95498faf99c16a2989bac4";

export default node;
