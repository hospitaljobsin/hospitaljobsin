/**
 * @generated SignedSource<<e8d187b4926d2a7650ca1db80ab463f2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationMembersViewClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationMembersTabFragment">;
  readonly " $fragmentType": "OrganizationMembersViewClientComponentFragment";
};
export type OrganizationMembersViewClientComponentFragment$key = {
  readonly " $data"?: OrganizationMembersViewClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationMembersViewClientComponentFragment">;
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
  "name": "OrganizationMembersViewClientComponentFragment",
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
      "name": "OrganizationMembersTabFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "95ce6583e178a578e848104566131c95";

export default node;
