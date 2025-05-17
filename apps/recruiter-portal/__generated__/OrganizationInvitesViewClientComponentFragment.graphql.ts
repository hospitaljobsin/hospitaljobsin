/**
 * @generated SignedSource<<2d34553260093ca6b90cd369b0801ccc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrganizationInvitesViewClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationInvitesViewFragment">;
  readonly " $fragmentType": "OrganizationInvitesViewClientComponentFragment";
};
export type OrganizationInvitesViewClientComponentFragment$key = {
  readonly " $data"?: OrganizationInvitesViewClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationInvitesViewClientComponentFragment">;
};

const node: ReaderFragment = {
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
  "name": "OrganizationInvitesViewClientComponentFragment",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "searchTerm",
          "variableName": "searchTerm"
        },
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "slug"
        }
      ],
      "kind": "FragmentSpread",
      "name": "OrganizationInvitesViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "61e36f066859de5324d53a0724ca02a7";

export default node;
