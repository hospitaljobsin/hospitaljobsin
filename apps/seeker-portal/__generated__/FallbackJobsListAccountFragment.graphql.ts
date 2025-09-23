/**
 * @generated SignedSource<<89e3e6ffe3c13e0b8382133ab8b8372e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type FallbackJobsListAccountFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"JobControlsAuthFragment">;
  readonly " $fragmentType": "FallbackJobsListAccountFragment";
};
export type FallbackJobsListAccountFragment$key = {
  readonly " $data"?: FallbackJobsListAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"FallbackJobsListAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FallbackJobsListAccountFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "JobControlsAuthFragment"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "87e9e26c721e6ada7b2ab43ddbf9412d";

export default node;
