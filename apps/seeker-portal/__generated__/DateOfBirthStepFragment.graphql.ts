/**
 * @generated SignedSource<<a0f1f64c22f4b1a620518be48b79c591>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type DateOfBirthStepFragment$data = {
  readonly profile: {
    readonly dateOfBirth: any | null | undefined;
  };
  readonly " $fragmentType": "DateOfBirthStepFragment";
};
export type DateOfBirthStepFragment$key = {
  readonly " $data"?: DateOfBirthStepFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DateOfBirthStepFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DateOfBirthStepFragment",
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
            "name": "dateOfBirth",
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

(node as any).hash = "fef4fa6cfe1e0654b09d3ff25c559f2f";

export default node;
