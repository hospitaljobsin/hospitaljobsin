/**
 * @generated SignedSource<<ad131362eb83f13368d4a1da1f97dab4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type JobDetailViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"JobDetailsFragment">;
  readonly " $fragmentType": "JobDetailViewFragment";
};
export type JobDetailViewFragment$key = {
  readonly " $data"?: JobDetailViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobDetailViewFragment">;
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
  "name": "JobDetailViewFragment",
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
      "name": "JobDetailsFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "e6b02cb59df58fc8de543b8afba0d04b";

export default node;
