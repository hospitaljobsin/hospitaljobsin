/**
 * @generated SignedSource<<fda8c76f0584782c5c843c95d02983fd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PublishJobModalFragment$data = {
  readonly id: string;
  readonly " $fragmentType": "PublishJobModalFragment";
};
export type PublishJobModalFragment$key = {
  readonly " $data"?: PublishJobModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PublishJobModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PublishJobModalFragment",
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

(node as any).hash = "f3b3591cf0cb4de6188e69d5268b7ef7";

export default node;
