/**
 * @generated SignedSource<<99d82c24d5d64a1ae2bef0ab21c7be41>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationInvitesViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationInvitesControllerFragment" | "OrganizationInvitesListFragment">;
  readonly " $fragmentType": "OrganizationInvitesViewFragment";
};
export type OrganizationInvitesViewFragment$key = {
  readonly " $data"?: OrganizationInvitesViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationInvitesViewFragment">;
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
  "name": "OrganizationInvitesViewFragment",
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
      "name": "OrganizationInvitesListFragment"
    },
    {
      "args": [
        (v0/*: any*/)
      ],
      "kind": "FragmentSpread",
      "name": "OrganizationInvitesControllerFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "4d3d2d35a3f54f77892c4110a8b7c20b";

export default node;
