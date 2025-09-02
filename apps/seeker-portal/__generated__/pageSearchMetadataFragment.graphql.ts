/**
 * @generated SignedSource<<c3a9383b9cc073a209ba9aea5466170f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageSearchMetadataFragment$data = {
  readonly jobs: {
    readonly totalCount: number | null | undefined;
  };
  readonly " $fragmentType": "pageSearchMetadataFragment";
};
export type pageSearchMetadataFragment$key = {
  readonly " $data"?: pageSearchMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageSearchMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageSearchMetadataFragment"
};

(node as any).hash = "9fe26716a46ef49678163fa7d17d455e";

export default node;
