/**
 * @generated SignedSource<<10321f8edae8e177d9de944e83bc4af0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobApplicationFlowFragment$data = {
  readonly profile: {
    readonly isComplete: boolean;
  };
  readonly " $fragmentSpreads": FragmentRefs<"CompleteProfileDrawerFragment">;
  readonly " $fragmentType": "JobApplicationFlowFragment";
};
export type JobApplicationFlowFragment$key = {
  readonly " $data"?: JobApplicationFlowFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobApplicationFlowFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobApplicationFlowFragment",
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
            "name": "isComplete",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      "action": "THROW"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CompleteProfileDrawerFragment"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "7df1a44534db709b2d860d15470b57c1";

export default node;
