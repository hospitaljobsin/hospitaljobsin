/**
 * @generated SignedSource<<c44a5060b196c695ff33a5474b878432>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageOrganizationMembersServerFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly __typename: "Organization";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "pageOrganizationMembersServerFragment";
};
export type pageOrganizationMembersServerFragment$key = {
  readonly " $data"?: pageOrganizationMembersServerFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageOrganizationMembersServerFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageOrganizationMembersServerFragment"
};

(node as any).hash = "74c7911b8d58c56c1a020903be6863ea";

export default node;
