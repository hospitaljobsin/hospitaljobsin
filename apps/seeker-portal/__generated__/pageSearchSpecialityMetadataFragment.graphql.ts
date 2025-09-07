/**
 * @generated SignedSource<<4fc9bf28a9d629e2b4fb42de6895eed0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderInlineDataFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type pageSearchSpecialityMetadataFragment$data = {
  readonly jobs: {
    readonly totalCount: number | null | undefined;
  };
  readonly " $fragmentType": "pageSearchSpecialityMetadataFragment";
};
export type pageSearchSpecialityMetadataFragment$key = {
  readonly " $data"?: pageSearchSpecialityMetadataFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"pageSearchSpecialityMetadataFragment">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "pageSearchSpecialityMetadataFragment"
};

(node as any).hash = "7129487fb5910179e8dac1754642bd32";

export default node;
