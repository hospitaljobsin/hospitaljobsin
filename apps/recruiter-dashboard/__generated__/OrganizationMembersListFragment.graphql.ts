/**
 * @generated SignedSource<<48807d705f71a75161cbaab87eb8bb56>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationMembersListFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"MemberOrganizationFragment" | "OrganizationMembersListInternalFragment">;
  readonly " $fragmentType": "OrganizationMembersListFragment";
};
export type OrganizationMembersListFragment$key = {
  readonly " $data"?: OrganizationMembersListFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationMembersListFragment">;
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
  "name": "OrganizationMembersListFragment",
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
      "name": "OrganizationMembersListInternalFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MemberOrganizationFragment"
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "d21ce1a785b2c0e45f17fd4685906481";

export default node;
