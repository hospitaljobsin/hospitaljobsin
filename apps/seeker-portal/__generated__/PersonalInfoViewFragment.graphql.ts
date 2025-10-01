/**
 * @generated SignedSource<<f714c2e090e64ef9ed321513309f941b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type PersonalInfoViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DesktopPersonalInfoViewFragment" | "MobilePersonalInfoViewFragment">;
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
      "name": "DesktopPersonalInfoViewFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MobilePersonalInfoViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "0ee33ae07959a1ef38187e7a167ba40d";

export default node;
