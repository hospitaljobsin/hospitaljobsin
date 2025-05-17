/**
 * @generated SignedSource<<eadc5f408a5849fe99b4011ef7328a17>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrganizationInvitesListFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly " $fragmentSpreads": FragmentRefs<"InviteOrganizationFragment" | "OrganizationInvitesListInternalFragment">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
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
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "slug"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationInvitesListFragment",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "slug",
          "variableName": "slug"
        }
      ],
      "concreteType": null,
      "kind": "LinkedField",
      "name": "organization",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__typename",
          "storageKey": null
        },
        {
          "kind": "InlineFragment",
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "59068a66908d3bb5f4c44d400dc22fce";

export default node;
