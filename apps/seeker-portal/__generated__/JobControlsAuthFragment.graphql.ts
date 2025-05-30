/**
 * @generated SignedSource<<f04e6f64fde1b6a061a1186caa3a428a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobControlsAuthFragment$data = {
  readonly __typename: string;
  readonly " $fragmentType": "JobControlsAuthFragment";
};
export type JobControlsAuthFragment$key = {
  readonly " $data"?: JobControlsAuthFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobControlsAuthFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobControlsAuthFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    }
  ],
  "type": "ViewerPayload",
  "abstractKey": "__isViewerPayload"
};

(node as any).hash = "17d205c8a0ed0ad7e659b2cad0cd7fd2";

export default node;
