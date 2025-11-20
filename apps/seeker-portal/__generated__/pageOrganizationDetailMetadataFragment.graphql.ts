/**
 * @generated SignedSource<<175fbc9a56e781036efd5d79838d91b8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageOrganizationDetailMetadataFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly bannerUrl: string;
    readonly descriptionCleaned: string | null | undefined;
    readonly homePageBannerUrl: string;
    readonly name: string;
    readonly socialLinks: {
      readonly facebookUrl: string | null | undefined;
      readonly instagramUrl: string | null | undefined;
      readonly linkedinUrl: string | null | undefined;
      readonly youtubeUrl: string | null | undefined;
    } | null | undefined;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "pageOrganizationDetailMetadataFragment";
};
export type pageOrganizationDetailMetadataFragment$key = {
  readonly " $data"?: pageOrganizationDetailMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageOrganizationDetailMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageOrganizationDetailMetadataFragment"
};

(node as any).hash = "bb1bcfd5f2534c5f0b45372ea6700c02";

export default node;
