/**
 * @generated SignedSource<<b29e15c2f01ab8d44d785367b66c1c5e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UnpublishJobModalFragment$data = {
  readonly id: string;
  readonly " $fragmentType": "UnpublishJobModalFragment";
};
export type UnpublishJobModalFragment$key = {
  readonly " $data"?: UnpublishJobModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UnpublishJobModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UnpublishJobModalFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "eb5438bc5be776119f29b74ec46ba188";

export default node;
