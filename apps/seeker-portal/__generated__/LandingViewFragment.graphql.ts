/**
 * @generated SignedSource<<e81506266071a77ecaabc561cfa4d06f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type LandingViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"JobListFragment">;
  readonly " $fragmentType": "LandingViewFragment";
};
export type LandingViewFragment$key = {
  readonly " $data"?: LandingViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LandingViewFragment">;
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
  "name": "LandingViewFragment",
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
      "name": "JobListFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "5bc7d63463bde5802e2d835bc0b0cb10";

export default node;
