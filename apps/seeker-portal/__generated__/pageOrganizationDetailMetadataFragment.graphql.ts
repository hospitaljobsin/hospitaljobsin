/**
 * @generated SignedSource<<975e1698eb9f487ec2ac33f5b84aee7c>>
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
    readonly description: string | null | undefined;
    readonly name: string;
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

(node as any).hash = "04f6f6e2d512d7bf7184176ca94183b4";

export default node;
