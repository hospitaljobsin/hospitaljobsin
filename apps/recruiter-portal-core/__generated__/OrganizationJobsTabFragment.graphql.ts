/**
 * @generated SignedSource<<1ecb72ee0c7036b2c0f4094ef48ce74d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationJobsTabFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationJobsControllerFragment" | "OrganizationJobsListFragment">;
  readonly " $fragmentType": "OrganizationJobsTabFragment";
};
export type OrganizationJobsTabFragment$key = {
  readonly " $data"?: OrganizationJobsTabFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationJobsTabFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "kind": "Variable",
  "name": "slug",
  "variableName": "slug"
};
return {
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
  "name": "OrganizationJobsTabFragment",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "searchTerm",
          "variableName": "searchTerm"
        },
        (v0/*: any*/)
      ],
      "kind": "FragmentSpread",
      "name": "OrganizationJobsListFragment"
    },
    {
      "args": [
        (v0/*: any*/)
      ],
      "kind": "FragmentSpread",
      "name": "OrganizationJobsControllerFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "6af7cbe72c1be3f4b9ea6e7411761069";

export default node;
