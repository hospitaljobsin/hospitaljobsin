/**
 * @generated SignedSource<<9eecb73d4b0dcf517667377e99851013>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationDetailsInternalFragment$data = {
  readonly descriptionHtml: string | null | undefined;
  readonly email: string | null | undefined;
  readonly employeeBenefits: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly description: string;
        readonly id: string;
        readonly order: number;
        readonly posterImageUrl: string | null | undefined;
        readonly title: string;
      };
    }>;
  };
  readonly homePageBannerUrl: string;
  readonly location: string | null | undefined;
  readonly logoUrl: string;
  readonly name: string;
  readonly socialLinks: {
    readonly facebookUrl: string | null | undefined;
    readonly instagramUrl: string | null | undefined;
    readonly linkedinUrl: string | null | undefined;
    readonly youtubeUrl: string | null | undefined;
  } | null | undefined;
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
      "name": "homePageBannerUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "descriptionHtml",
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
      "concreteType": "SocialLinks",
      "kind": "LinkedField",
      "name": "socialLinks",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "linkedinUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "youtubeUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "instagramUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "facebookUrl",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 100
        }
      ],
      "concreteType": "EmployeeBenefitConnection",
      "kind": "LinkedField",
      "name": "employeeBenefits",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "EmployeeBenefitEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "EmployeeBenefit",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "title",
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
                  "name": "posterImageUrl",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "order",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "employeeBenefits(first:100)"
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

(node as any).hash = "1ae5edeab3197e36312c63d86008c6a1";

export default node;
