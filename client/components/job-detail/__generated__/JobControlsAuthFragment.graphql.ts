/**
 * @generated SignedSource<<9eaad90a61fd094487f97a4c7c17c836>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
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
