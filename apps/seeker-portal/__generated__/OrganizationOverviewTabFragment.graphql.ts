/**
 * @generated SignedSource<<cc81b7c74559cd62eaa5191f732d1d83>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationOverviewTabFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationDetailsFragment" | "OrganizationJobsListFragment">;
  readonly " $fragmentType": "OrganizationOverviewTabFragment";
};
export type OrganizationOverviewTabFragment$key = {
  readonly " $data"?: OrganizationOverviewTabFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationOverviewTabFragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "slug"
  }
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "slug"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationOverviewTabFragment",
  "selections": [
    {
      "args": (v0/*: any*/),
      "kind": "FragmentSpread",
      "name": "OrganizationDetailsFragment"
    },
    {
      "args": (v0/*: any*/),
      "kind": "FragmentSpread",
      "name": "OrganizationJobsListFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "a382471a36f8b099b7515b39be0c2d62";

export default node;
