/**
 * @generated SignedSource<<fb2b0738264657a8615617a62f2a9d01>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DeleteSessionModalFragment$data = {
  readonly id: string;
  readonly " $fragmentType": "DeleteSessionModalFragment";
};
export type DeleteSessionModalFragment$key = {
  readonly " $data"?: DeleteSessionModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DeleteSessionModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DeleteSessionModalFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "Session",
  "abstractKey": null
};

(node as any).hash = "f6a9b8ac9a8834bc678a594a7e22a63f";

export default node;
