/**
 * @generated SignedSource<<07b3160be7f2b92e35d3e7290360f7bf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type DashboardViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationJobsControllerFragment" | "OrganizationJobsListFragment">;
  readonly " $fragmentType": "DashboardViewFragment";
};
export type DashboardViewFragment$key = {
  readonly " $data"?: DashboardViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DashboardViewFragment">;
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
  "name": "DashboardViewFragment",
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

(node as any).hash = "d965412bb16b0c4bd62e82bb450df22e";

export default node;
