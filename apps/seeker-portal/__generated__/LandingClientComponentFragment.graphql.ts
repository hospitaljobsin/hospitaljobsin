/**
 * @generated SignedSource<<9c9bef5d19be7afc72ba57379457ebef>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LandingClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"LandingViewFragment">;
  readonly " $fragmentType": "LandingClientComponentFragment";
};
export type LandingClientComponentFragment$key = {
  readonly " $data"?: LandingClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LandingClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "coordinates"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "proximityKm"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "searchTerm"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "LandingClientComponentFragment",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "coordinates",
          "variableName": "coordinates"
        },
        {
          "kind": "Variable",
          "name": "proximityKm",
          "variableName": "proximityKm"
        },
        {
          "kind": "Variable",
          "name": "searchTerm",
          "variableName": "searchTerm"
        }
      ],
      "kind": "FragmentSpread",
      "name": "LandingViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "3f1c6f103fbd63a366986a3d461ef3ea";

export default node;
