/**
 * @generated SignedSource<<9638fb0bdd3b3c515453a0abafc54b96>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type EducationFragment$data = {
  readonly __typename: "Profile";
  readonly education: ReadonlyArray<{
    readonly degree: string;
    readonly institution: string;
    readonly yearCompleted: number;
  }>;
  readonly " $fragmentType": "EducationFragment";
};
export type EducationFragment$key = {
  readonly " $data"?: EducationFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"EducationFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EducationFragment",
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

(node as any).hash = "a5e9b3b953e9bbad409c84727fac7d6e";

export default node;
