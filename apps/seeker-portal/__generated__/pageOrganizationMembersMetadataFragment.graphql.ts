/**
 * @generated SignedSource<<a79438758c5eface5ca1dab943d4da7d>>
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

(node as any).hash = "59d2243e6949cf493b65c190c9566bee";

export default node;
