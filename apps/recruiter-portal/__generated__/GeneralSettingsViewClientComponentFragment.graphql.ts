/**
 * @generated SignedSource<<e5a8941b266ddaf782bd5ec1826f66e6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GeneralSettingsViewClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"GeneralSettingsViewFragment">;
  readonly " $fragmentType": "GeneralSettingsViewClientComponentFragment";
};
export type GeneralSettingsViewClientComponentFragment$key = {
  readonly " $data"?: GeneralSettingsViewClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"GeneralSettingsViewClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "slug"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "GeneralSettingsViewClientComponentFragment",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "slug"
        }
      ],
      "kind": "FragmentSpread",
      "name": "GeneralSettingsViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "c2fe1ab211175885e06708871ac285a7";

export default node;
