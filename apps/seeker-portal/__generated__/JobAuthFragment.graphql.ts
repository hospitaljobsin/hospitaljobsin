/**
 * @generated SignedSource<<bfa69a3cdb15f1364ee47d0d65f17486>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobAuthFragment$data = {
  readonly __typename: string;
  readonly " $fragmentType": "JobAuthFragment";
};
export type JobAuthFragment$key = {
  readonly " $data"?: JobAuthFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobAuthFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobAuthFragment",
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

(node as any).hash = "dff01ba726fdb61e390ec84beef42ed1";

export default node;
