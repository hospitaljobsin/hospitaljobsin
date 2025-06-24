/**
 * @generated SignedSource<<ba6a26a0daff7dc527d18e0c9deae379>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ApplicantChatFragment$data = {
  readonly account: {
    readonly fullName: string;
  };
  readonly " $fragmentType": "ApplicantChatFragment";
};
export type ApplicantChatFragment$key = {
  readonly " $data"?: ApplicantChatFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ApplicantChatFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ApplicantChatFragment",
  "selections": [
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "account",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "fullName",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      "action": "THROW"
    }
  ],
  "type": "JobApplicant",
  "abstractKey": null
};

(node as any).hash = "976cbea2b7987f379d8e8362213cd9c5";

export default node;
