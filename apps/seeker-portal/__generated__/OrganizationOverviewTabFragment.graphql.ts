/**
 * @generated SignedSource<<f5c30a350f3b969c7521ee04f790ee39>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationOverviewTabFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrgDetailHeaderFragment" | "OrganizationDetailsFragment" | "OrganizationJobsListFragment">;
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
      "name": "OrgDetailHeaderFragment"
    },
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

(node as any).hash = "336ef86cc80d64b573bb90e47f7f11c9";

export default node;
