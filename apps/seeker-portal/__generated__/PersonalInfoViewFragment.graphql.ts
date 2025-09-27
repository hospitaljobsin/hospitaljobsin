/**
 * @generated SignedSource<<832e0ce2241a316d8c0a0e6f2512b8f5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type PersonalInfoViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment">;
  readonly " $fragmentType": "PersonalInfoViewFragment";
};
export type PersonalInfoViewFragment$key = {
  readonly " $data"?: PersonalInfoViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PersonalInfoViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PersonalInfoViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DashboardHeaderFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "aebac583ab8f8d97ed8085fe279f5f0c";

export default node;
