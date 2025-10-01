/**
 * @generated SignedSource<<a3315cb6f0a4f345fdd8988f3db7088c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ResumeUploadStepFragment$data = {
  readonly profile: {
    readonly resumeUrl: string | null | undefined;
  };
  readonly " $fragmentType": "ResumeUploadStepFragment";
};
export type ResumeUploadStepFragment$key = {
  readonly " $data"?: ResumeUploadStepFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ResumeUploadStepFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ResumeUploadStepFragment",
  "selections": [
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "concreteType": "Profile",
        "kind": "LinkedField",
        "name": "profile",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "resumeUrl",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      "action": "THROW"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "e78e68ca6db96df3cd7d2c0daf54a550";

export default node;
