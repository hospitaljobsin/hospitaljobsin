/**
 * @generated SignedSource<<8f9aa4dc87e1a8099b7744318510831c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobApplyViewClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"JobApplyViewFragment">;
  readonly " $fragmentType": "JobApplyViewClientComponentFragment";
};
export type JobApplyViewClientComponentFragment$key = {
  readonly " $data"?: JobApplyViewClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobApplyViewClientComponentFragment">;
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
  "name": "JobApplyViewClientComponentFragment",
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
      "name": "JobApplyViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "265ee8cb7ff5df311fc26117e5e2f1a6";

export default node;
