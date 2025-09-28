/**
 * @generated SignedSource<<dc9af7704dad0683a29b1e222b1d3add>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type ResumeProgressAccountFragment$data = {
  readonly profile: {
    readonly progressPercentage: number;
  };
  readonly " $fragmentType": "ResumeProgressAccountFragment";
};
export type ResumeProgressAccountFragment$key = {
  readonly " $data"?: ResumeProgressAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ResumeProgressAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ResumeProgressAccountFragment",
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
            "name": "progressPercentage",
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

(node as any).hash = "ed8859bc5257f36935557337f5517478";

export default node;
