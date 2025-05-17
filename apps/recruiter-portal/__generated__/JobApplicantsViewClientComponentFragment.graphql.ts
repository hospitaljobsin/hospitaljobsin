/**
 * @generated SignedSource<<8bd068a52e696113c7d26b93de84444b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type JobApplicantsViewClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantsTabFragment">;
  readonly " $fragmentType": "JobApplicantsViewClientComponentFragment";
};
export type JobApplicantsViewClientComponentFragment$key = {
  readonly " $data"?: JobApplicantsViewClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobApplicantsViewClientComponentFragment">;
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
      "name": "searchTerm"
    },
    {
      "defaultValue": true,
      "kind": "LocalArgument",
      "name": "showStatus"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "slug"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "status"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobApplicantsViewClientComponentFragment",
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
          "name": "searchTerm",
          "variableName": "searchTerm"
        },
        {
          "kind": "Variable",
          "name": "showStatus",
          "variableName": "showStatus"
        },
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "slug"
        },
        {
          "kind": "Variable",
          "name": "status",
          "variableName": "status"
        }
      ],
      "kind": "FragmentSpread",
      "name": "ApplicantsTabFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "da38683a1292ab7fb89bd33e5830534a";

export default node;
