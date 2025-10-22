/**
 * @generated SignedSource<<003ac3bbc5658b02da0b52107ef44cce>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type routeOrganizationMarkdownFragment$data = {
  readonly organization: {
    readonly __typename: "Organization";
    readonly descriptionCleaned: string | null | undefined;
    readonly email: string | null | undefined;
    readonly location: string | null | undefined;
    readonly name: string;
    readonly verificationStatus: {
      readonly __typename: string;
      readonly verified: {
        readonly verifiedAt: any;
      } | null | undefined;
    };
    readonly website: string | null | undefined;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "routeOrganizationMarkdownFragment";
};
export type routeOrganizationMarkdownFragment$key = {
  readonly " $data"?: routeOrganizationMarkdownFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"routeOrganizationMarkdownFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "routeOrganizationMarkdownFragment"
};

(node as any).hash = "76842c32bede764bf3046fbb8361a807";

export default node;
