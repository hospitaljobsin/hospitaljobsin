/**
 * @generated SignedSource<<9740f23263a83f63645e3475aaa79357>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ShareJobModalFragment$data = {
  readonly slug: string;
  readonly title: string;
  readonly " $fragmentType": "ShareJobModalFragment";
};
export type ShareJobModalFragment$key = {
  readonly " $data"?: ShareJobModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ShareJobModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShareJobModalFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    }
  ],
  "type": "Job",
  "abstractKey": null
};

(node as any).hash = "2883d35bbb6197c19dcccb7055d6fdcb";

export default node;
