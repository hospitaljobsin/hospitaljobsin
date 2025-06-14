/**
 * @generated SignedSource<<472b3f369a613be625fa5bbc2ac34b52>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type MemberSettingsTabFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationMembersControllerFragment" | "OrganizationMembersListFragment">;
  readonly " $fragmentType": "MemberSettingsTabFragment";
};
export type MemberSettingsTabFragment$key = {
  readonly " $data"?: MemberSettingsTabFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MemberSettingsTabFragment">;
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
  "name": "MemberSettingsTabFragment",
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

(node as any).hash = "5e14d4478ee908bb0ffe7f4fe1955268";

export default node;
