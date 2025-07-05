/**
 * @generated SignedSource<<758a33a228fcaae4547a535c87e2f453>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LandingViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"JobListFragment" | "LandingHeaderFragment">;
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "LandingHeaderFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "ad44d00732dc42125672d8a8cd454ca6";

export default node;
