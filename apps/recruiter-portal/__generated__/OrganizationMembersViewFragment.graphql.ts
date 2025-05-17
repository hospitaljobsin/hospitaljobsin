/**
 * @generated SignedSource<<1c45b1c43f4f092bc6221ad35ff30add>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
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
