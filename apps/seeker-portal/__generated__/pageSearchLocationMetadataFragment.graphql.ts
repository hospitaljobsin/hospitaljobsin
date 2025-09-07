/**
 * @generated SignedSource<<c84caf6ec8d3324a19872ee0518469e6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageSearchLocationMetadataFragment$data = {
  readonly jobs: {
    readonly totalCount: number | null | undefined;
  };
  readonly " $fragmentType": "pageSearchLocationMetadataFragment";
};
export type pageSearchLocationMetadataFragment$key = {
  readonly " $data"?: pageSearchLocationMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageSearchLocationMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageSearchLocationMetadataFragment"
};

(node as any).hash = "5e121d07631c28c164b478907634d669";

export default node;
