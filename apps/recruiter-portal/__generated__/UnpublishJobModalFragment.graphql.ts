/**
 * @generated SignedSource<<39366e7f057ebe35fb124cf1b38cdad2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
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
