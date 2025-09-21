/**
 * @generated SignedSource<<eb78a4cebdfbad637230630b524b098c>>
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
    readonly descriptionCleaned: string | null | undefined;
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

(node as any).hash = "8bd6e5a09ecce52dc25e3934e4ba030c";

export default node;
