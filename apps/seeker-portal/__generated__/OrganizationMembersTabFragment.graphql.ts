/**
 * @generated SignedSource<<06117d03c4f6d220c162f5166d495e9b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationMembersTabFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrgDetailHeaderFragment" | "OrganizationMembersListFragment">;
  readonly " $fragmentType": "OrganizationMembersTabFragment";
};
export type OrganizationMembersTabFragment$key = {
  readonly " $data"?: OrganizationMembersTabFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationMembersTabFragment">;
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
  "name": "OrganizationMembersTabFragment",
  "selections": [
    {
      "args": (v0/*: any*/),
      "kind": "FragmentSpread",
      "name": "OrgDetailHeaderFragment"
    },
    {
      "args": (v0/*: any*/),
      "kind": "FragmentSpread",
      "name": "OrganizationMembersListFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "35e4341423e0965f0d7c3cbb0422aabb";

export default node;
