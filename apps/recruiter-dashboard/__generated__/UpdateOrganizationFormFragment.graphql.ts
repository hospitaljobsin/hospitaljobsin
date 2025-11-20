/**
 * @generated SignedSource<<fc519ff6dfe0be132b2f048b1829a524>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateOrganizationFormFragment$data = {
  readonly bannerUrl: string;
  readonly description: string | null | undefined;
  readonly homePageBannerUrl: string;
  readonly id: string;
  readonly location: string | null | undefined;
  readonly logoUrl: string;
  readonly name: string;
  readonly slug: string;
  readonly socialLinks: {
    readonly facebookUrl: string | null | undefined;
    readonly instagramUrl: string | null | undefined;
    readonly linkedinUrl: string | null | undefined;
    readonly youtubeUrl: string | null | undefined;
  } | null | undefined;
  readonly website: string | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"DeleteOrganizationBannerModalFragment" | "DeleteOrganizationLogoModalFragment">;
  readonly " $fragmentType": "UpdateOrganizationFormFragment";
};
export type UpdateOrganizationFormFragment$key = {
  readonly " $data"?: UpdateOrganizationFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateOrganizationFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateOrganizationFormFragment",
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
      "name": "slug",
      "storageKey": null
    },
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
      "name": "website",
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
      "name": "bannerUrl",
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
      "args": null,
      "kind": "ScalarField",
      "name": "description",
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
      "args": null,
      "kind": "FragmentSpread",
      "name": "DeleteOrganizationLogoModalFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DeleteOrganizationBannerModalFragment"
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "91d9ddca8b2181cde92fdcbb8107e9a1";

export default node;
