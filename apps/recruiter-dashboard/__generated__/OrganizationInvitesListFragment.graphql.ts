/**
 * @generated SignedSource<<ad130254845c0e094a2f409e3674cf07>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationInvitesListFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"InviteOrganizationFragment" | "OrganizationInvitesListInternalFragment">;
  readonly " $fragmentType": "OrganizationInvitesListFragment";
};
export type OrganizationInvitesListFragment$key = {
  readonly " $data"?: OrganizationInvitesListFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationInvitesListFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "searchTerm"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationInvitesListFragment",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "searchTerm",
          "variableName": "searchTerm"
        }
      ],
      "kind": "FragmentSpread",
      "name": "OrganizationInvitesListInternalFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "InviteOrganizationFragment"
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "2cbaba43a90d774f93173637a45766b9";

export default node;
