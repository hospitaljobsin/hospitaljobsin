/**
 * @generated SignedSource<<e50c8d1d4b6fc4d95d4bc3fe9b3e04f4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateResumeFormFragment$data = {
  readonly resumeUrl: string | null | undefined;
  readonly " $fragmentType": "UpdateResumeFormFragment";
};
export type UpdateResumeFormFragment$key = {
  readonly " $data"?: UpdateResumeFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateResumeFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateResumeFormFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "resumeUrl",
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "392b655dc862a7f7ac8d17f48ed5307f";

export default node;
