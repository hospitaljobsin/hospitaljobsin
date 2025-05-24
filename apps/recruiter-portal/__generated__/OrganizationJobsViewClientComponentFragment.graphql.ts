/**
 * @generated SignedSource<<46bb6483cdaf87bd4a5d11ae8f1da33f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationJobsViewClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationJobsTabFragment">;
  readonly " $fragmentType": "OrganizationJobsViewClientComponentFragment";
};
export type OrganizationJobsViewClientComponentFragment$key = {
  readonly " $data"?: OrganizationJobsViewClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationJobsViewClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "searchTerm"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "slug"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationJobsViewClientComponentFragment",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "searchTerm",
          "variableName": "searchTerm"
        },
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "slug"
        }
      ],
      "kind": "FragmentSpread",
      "name": "OrganizationJobsTabFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "9a306e878e14434114d47bd1db719762";

export default node;
