/**
 * @generated SignedSource<<ac7c221424e107aef58f0bdbe24e6cc6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type DashboardViewFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly isMember: boolean;
    readonly name: string;
    readonly " $fragmentSpreads": FragmentRefs<"OrganizationJobsControllerFragment" | "OrganizationJobsListFragment">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "DashboardViewFragment";
};
export type DashboardViewFragment$key = {
  readonly " $data"?: DashboardViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DashboardViewFragment">;
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
    },
    {
      "defaultValue": "CREATED_AT",
      "kind": "LocalArgument",
      "name": "sortBy"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "DashboardViewFragment",
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
              "name": "name",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isMember",
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "OrganizationJobsControllerFragment"
            },
            {
              "args": [
                {
                  "kind": "Variable",
                  "name": "searchTerm",
                  "variableName": "searchTerm"
                },
                {
                  "kind": "Variable",
                  "name": "sortBy",
                  "variableName": "sortBy"
                }
              ],
              "kind": "FragmentSpread",
              "name": "OrganizationJobsListFragment"
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

(node as any).hash = "18865327e301b39154fcd4a63f1e1707";

export default node;
