/**
 * @generated SignedSource<<c05efd4dbad321075b9cb6dd59521f97>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageSearchMapSpecialityMetadataFragment$data = {
  readonly jobs: {
    readonly totalCount: number | null | undefined;
  };
  readonly " $fragmentType": "pageSearchMapSpecialityMetadataFragment";
};
export type pageSearchMapSpecialityMetadataFragment$key = {
  readonly " $data"?: pageSearchMapSpecialityMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageSearchMapSpecialityMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageSearchMapSpecialityMetadataFragment"
};

(node as any).hash = "379789209f36be53cfa3e7822c22f3d9";

export default node;
