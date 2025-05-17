/**
 * @generated SignedSource<<8b9d43e2b137f822454416984ea30720>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageOrganizationDetailMetadataFragment$data = {
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

(node as any).hash = "8fa06125d8030aa83674584c7ff62153";

export default node;
