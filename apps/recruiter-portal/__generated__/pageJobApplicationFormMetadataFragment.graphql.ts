/**
 * @generated SignedSource<<29a06ffaf241df61e8e94e67fe6f2013>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pageJobApplicationFormMetadataFragment$data = {
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
  readonly " $fragmentType": "pageJobApplicationFormMetadataFragment";
};
export type pageJobApplicationFormMetadataFragment$key = {
  readonly " $data"?: pageJobApplicationFormMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageJobApplicationFormMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageJobApplicationFormMetadataFragment"
};

(node as any).hash = "d7fd9311ceb76c2c380e9c374434974a";

export default node;
