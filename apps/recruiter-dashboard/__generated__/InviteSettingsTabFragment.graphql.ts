/**
 * @generated SignedSource<<bf77493b1d57ba6892c2246a57e8d23f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type InviteSettingsTabFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly isAdmin: boolean;
    readonly " $fragmentSpreads": FragmentRefs<"OrganizationInvitesControllerFragment" | "OrganizationInvitesListFragment">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "InviteSettingsTabFragment";
};
export type InviteSettingsTabFragment$key = {
  readonly " $data"?: InviteSettingsTabFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"InviteSettingsTabFragment">;
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
  "name": "InviteSettingsTabFragment",
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
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isAdmin",
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "OrganizationInvitesControllerFragment"
            },
            {
              "args": [
                {
                  "kind": "Variable",
                  "name": "searchTerm",
                  "variableName": "searchTerm"
                }
              ],
              "kind": "FragmentSpread",
              "name": "OrganizationInvitesListFragment"
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

(node as any).hash = "3619535b466e3736b088354c4654dcdb";

export default node;
