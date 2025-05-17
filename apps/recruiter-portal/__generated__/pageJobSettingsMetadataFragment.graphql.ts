/**
 * @generated SignedSource<<3f6efd2d80c75a604fb4f8bbab7ef12f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageJobSettingsMetadataFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly description: string | null | undefined;
    readonly isAdmin: boolean;
    readonly job: {
      readonly __typename: "Job";
      readonly title: string;
    } | {
      // This will never be '%other', but we need some
      // value in case none of the concrete values match.
      readonly __typename: "%other";
    };
    readonly logoUrl: string;
    readonly name: string;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "pageJobSettingsMetadataFragment";
};
export type pageJobSettingsMetadataFragment$key = {
  readonly " $data"?: pageJobSettingsMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageJobSettingsMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageJobSettingsMetadataFragment"
};

(node as any).hash = "28686c34429e07589ddb015cfc2aa0ff";

export default node;
