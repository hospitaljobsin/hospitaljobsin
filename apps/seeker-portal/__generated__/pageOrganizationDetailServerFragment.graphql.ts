/**
 * @generated SignedSource<<ef9fb79828424e0822be1e40b43a3ae9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageOrganizationDetailServerFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly __typename: "Organization";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "pageOrganizationDetailServerFragment";
};
export type pageOrganizationDetailServerFragment$key = {
  readonly " $data"?: pageOrganizationDetailServerFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageOrganizationDetailServerFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageOrganizationDetailServerFragment"
};

(node as any).hash = "911c768c69f5234617a0a80b972d838f";

export default node;
