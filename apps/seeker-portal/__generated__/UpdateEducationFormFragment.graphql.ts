/**
 * @generated SignedSource<<c5a75da1f2829f7f94c7dcdc29f1e5ef>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateEducationFormFragment$data = {
  readonly __typename: "Profile";
  readonly education: ReadonlyArray<{
    readonly degree: string;
    readonly institution: string;
    readonly yearCompleted: number;
  }>;
  readonly " $fragmentType": "UpdateEducationFormFragment";
};
export type UpdateEducationFormFragment$key = {
  readonly " $data"?: UpdateEducationFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateEducationFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateEducationFormFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Education",
      "kind": "LinkedField",
      "name": "education",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "degree",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "institution",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "yearCompleted",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "2a7cba6e8b36f5167936a6c1e04f53e7";

export default node;
