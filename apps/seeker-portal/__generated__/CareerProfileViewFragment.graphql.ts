/**
 * @generated SignedSource<<93cacfb2cb9b2be20a581cda07c27435>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type CareerProfileViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DesktopCareerProfileViewFragment" | "MobileCareerProfileViewFragment">;
  readonly " $fragmentType": "CareerProfileViewFragment";
};
export type CareerProfileViewFragment$key = {
  readonly " $data"?: CareerProfileViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"CareerProfileViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CareerProfileViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DesktopCareerProfileViewFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MobileCareerProfileViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "31efc317ac1a3af4ff4cdf83e09efc45";

export default node;
