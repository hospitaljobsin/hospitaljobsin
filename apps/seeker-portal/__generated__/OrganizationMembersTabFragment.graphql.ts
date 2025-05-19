/**
 * @generated SignedSource<<a13543d015c63a09f9907c21ecf3ce62>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationMembersTabFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationMembersListFragment">;
  readonly " $fragmentType": "OrganizationMembersTabFragment";
};
export type OrganizationMembersTabFragment$key = {
  readonly " $data"?: OrganizationMembersTabFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationMembersTabFragment">;
};

const node: ReaderFragment = {
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
      "args": [
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "slug"
        }
      ],
      "kind": "FragmentSpread",
      "name": "OrganizationMembersListFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "7fd86a7a706973836d05584079acbf12";

export default node;
