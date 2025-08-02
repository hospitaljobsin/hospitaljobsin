/**
 * @generated SignedSource<<c9dbac250108c4c7f70c231b6416d822>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationDetailsInternalFragment$data = {
  readonly description: string | null | undefined;
  readonly email: string | null | undefined;
  readonly location: string | null | undefined;
  readonly logoUrl: string;
  readonly name: string;
  readonly verificationStatus: {
    readonly __typename: string;
    readonly message?: string;
    readonly rejectedAt?: any;
    readonly requestedAt?: any;
    readonly verified: {
      readonly verifiedAt: any;
    } | null | undefined;
  };
  readonly website: string | null | undefined;
  readonly " $fragmentType": "OrganizationDetailsInternalFragment";
};
export type OrganizationDetailsInternalFragment$key = {
  readonly " $data"?: OrganizationDetailsInternalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationDetailsInternalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationDetailsInternalFragment",
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
      "name": "logoUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "website",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "location",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "verificationStatus",
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
          "fragment": {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "verifiedAt",
                "storageKey": null
              }
            ],
            "type": "Verified",
            "abstractKey": null
          },
          "kind": "AliasedInlineFragmentSpread",
          "name": "verified"
        },
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "rejectedAt",
              "storageKey": null
            }
          ],
          "type": "Rejected",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "requestedAt",
              "storageKey": null
            }
          ],
          "type": "Pending",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "message",
              "storageKey": null
            }
          ],
          "type": "NotRequested",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "43d389df941962084d8ef599ca24a24f";

export default node;
