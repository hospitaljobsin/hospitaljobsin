/**
 * @generated SignedSource<<33d4860bd376a14dc67f81d395a67e2d>>
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
    readonly description: string | null | undefined;
    readonly isAdmin: boolean;
    readonly isMember: boolean;
    readonly logoUrl: string;
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

(node as any).hash = "5b34c36d2a4b2b3dbac86566f26daa2a";

export default node;
