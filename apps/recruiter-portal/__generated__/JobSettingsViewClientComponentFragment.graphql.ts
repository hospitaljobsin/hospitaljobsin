/**
 * @generated SignedSource<<e7266ed98d2166bea9d7e0e82c3a7883>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobSettingsViewClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"JobSettingsGeneralTabFragment">;
  readonly " $fragmentType": "JobSettingsViewClientComponentFragment";
};
export type JobSettingsViewClientComponentFragment$key = {
  readonly " $data"?: JobSettingsViewClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobSettingsViewClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "jobSlug"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "slug"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobSettingsViewClientComponentFragment",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "jobSlug",
          "variableName": "jobSlug"
        },
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "slug"
        }
      ],
      "kind": "FragmentSpread",
      "name": "JobSettingsGeneralTabFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "54d79320a5614775c816fcac3f8f791a";

export default node;
