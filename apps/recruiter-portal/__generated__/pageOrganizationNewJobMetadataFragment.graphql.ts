/**
 * @generated SignedSource<<72ccbbd499ea07a57be083bebe71b5c5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageOrganizationNewJobMetadataFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly description: string | null | undefined;
    readonly isAdmin: boolean;
    readonly logoUrl: string;
    readonly name: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "pageOrganizationNewJobMetadataFragment";
};
export type pageOrganizationNewJobMetadataFragment$key = {
  readonly " $data"?: pageOrganizationNewJobMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageOrganizationNewJobMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageOrganizationNewJobMetadataFragment"
};

(node as any).hash = "bfa3fc36089b173cb60c317cf0ad45f9";

export default node;
