/**
 * @generated SignedSource<<5571f11e391f9bfe5cfba518bd9ade83>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageOrganizationMembersMetadataFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly bannerUrl: string;
    readonly description: string | null | undefined;
    readonly name: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "pageOrganizationMembersMetadataFragment";
};
export type pageOrganizationMembersMetadataFragment$key = {
  readonly " $data"?: pageOrganizationMembersMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageOrganizationMembersMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageOrganizationMembersMetadataFragment"
};

(node as any).hash = "67b3ac51c5f01f982ee4e8ac343cfeff";

export default node;
