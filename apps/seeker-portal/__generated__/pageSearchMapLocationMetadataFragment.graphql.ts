/**
 * @generated SignedSource<<cc5e85186f02c0d33d1a97a2503861c9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageSearchMapLocationMetadataFragment$data = {
  readonly jobs: {
    readonly totalCount: number | null | undefined;
  };
  readonly " $fragmentType": "pageSearchMapLocationMetadataFragment";
};
export type pageSearchMapLocationMetadataFragment$key = {
  readonly " $data"?: pageSearchMapLocationMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageSearchMapLocationMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageSearchMapLocationMetadataFragment"
};

(node as any).hash = "f6c500e296e1d31de372f144a7707f3b";

export default node;
