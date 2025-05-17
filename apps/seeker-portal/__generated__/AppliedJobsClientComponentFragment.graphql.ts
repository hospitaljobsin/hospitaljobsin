/**
 * @generated SignedSource<<83487f421259636a7d8abcfc988e8f2d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AppliedJobsClientComponentFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"AppliedJobsViewFragment">;
  readonly " $fragmentType": "AppliedJobsClientComponentFragment";
};
export type AppliedJobsClientComponentFragment$key = {
  readonly " $data"?: AppliedJobsClientComponentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AppliedJobsClientComponentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AppliedJobsClientComponentFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "AppliedJobsViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "2d92fe7dce2f28824728af705cc37e50";

export default node;
