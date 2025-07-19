/**
 * @generated SignedSource<<258f97bf3fbee6695c839658e405ddff>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationJobsListFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationJobsListInternalFragment">;
  readonly " $fragmentType": "OrganizationJobsListFragment";
};
export type OrganizationJobsListFragment$key = {
  readonly " $data"?: OrganizationJobsListFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationJobsListFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "searchTerm"
    },
    {
      "defaultValue": "CREATED_AT",
      "kind": "LocalArgument",
      "name": "sortBy"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationJobsListFragment",
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
          "name": "sortBy",
          "variableName": "sortBy"
        }
      ],
      "kind": "FragmentSpread",
      "name": "OrganizationJobsListInternalFragment"
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "440be02e2fc49c569fe13e3d916ab6f1";

export default node;
