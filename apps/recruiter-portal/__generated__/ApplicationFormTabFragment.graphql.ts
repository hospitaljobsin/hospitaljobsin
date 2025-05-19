/**
 * @generated SignedSource<<e300ab8db33f7556cabdaf79a85c8efc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ApplicationFormTabFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ApplicationFormBuilderFragment">;
  readonly " $fragmentType": "ApplicationFormTabFragment";
};
export type ApplicationFormTabFragment$key = {
  readonly " $data"?: ApplicationFormTabFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicationFormTabFragment">;
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
  "name": "ApplicationFormTabFragment",
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
      "name": "ApplicationFormBuilderFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "0732ceaed4b4b4c0abca19a909a022ad";

export default node;
