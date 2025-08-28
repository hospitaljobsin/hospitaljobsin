/**
 * @generated SignedSource<<107d04bc90e7c5908f3f40540303b834>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationMembersViewClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrgDetailHeaderFragment" | "OrganizationMembersTabFragment">;
  readonly " $fragmentType": "OrganizationMembersViewClientComponentFragment";
};
export type OrganizationMembersViewClientComponentFragment$key = {
  readonly " $data"?: OrganizationMembersViewClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationMembersViewClientComponentFragment">;
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
  "name": "OrganizationMembersViewClientComponentFragment",
  "selections": [
    {
      "args": (v0/*: any*/),
      "kind": "FragmentSpread",
      "name": "OrgDetailHeaderFragment"
    },
    {
      "args": (v0/*: any*/),
      "kind": "FragmentSpread",
      "name": "OrganizationMembersTabFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "3ef6f945ad83b939a076fc755e73dad1";

export default node;
