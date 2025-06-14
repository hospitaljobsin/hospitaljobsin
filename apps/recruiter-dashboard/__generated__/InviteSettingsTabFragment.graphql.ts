/**
 * @generated SignedSource<<5b6ea4489761088b62f28d1419e17023>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type InviteSettingsTabFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationInvitesControllerFragment" | "OrganizationInvitesListFragment">;
  readonly " $fragmentType": "InviteSettingsTabFragment";
};
export type InviteSettingsTabFragment$key = {
  readonly " $data"?: InviteSettingsTabFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"InviteSettingsTabFragment">;
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
  "name": "InviteSettingsTabFragment",
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

(node as any).hash = "5f4a943d46f06c3c5366a24a002057e9";

export default node;
