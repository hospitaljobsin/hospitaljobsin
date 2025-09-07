/**
 * @generated SignedSource<<264d910843b9e5ef5bcf3d5642834998>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageSearchLocationSpecialityMetadataFragment$data = {
  readonly jobs: {
    readonly totalCount: number | null | undefined;
  };
  readonly " $fragmentType": "pageSearchLocationSpecialityMetadataFragment";
};
export type pageSearchLocationSpecialityMetadataFragment$key = {
  readonly " $data"?: pageSearchLocationSpecialityMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageSearchLocationSpecialityMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageSearchLocationSpecialityMetadataFragment"
};

(node as any).hash = "99796accfa7ce420b4e2062626060ccf";

export default node;
