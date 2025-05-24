/**
 * @generated SignedSource<<57ef5380d5f03f89f393d37e1918cdee>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationMembersViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationMembersControllerFragment" | "OrganizationMembersListFragment">;
  readonly " $fragmentType": "OrganizationMembersViewFragment";
};
export type OrganizationMembersViewFragment$key = {
  readonly " $data"?: OrganizationMembersViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationMembersViewFragment">;
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
  "name": "OrganizationMembersViewFragment",
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
      "name": "OrganizationMembersListFragment"
    },
    {
      "args": [
        (v0/*: any*/)
      ],
      "kind": "FragmentSpread",
      "name": "OrganizationMembersControllerFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "4404bf203b6ca8c262c92766e9c446ad";

export default node;
