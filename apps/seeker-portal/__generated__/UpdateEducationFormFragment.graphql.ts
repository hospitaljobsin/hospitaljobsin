/**
 * @generated SignedSource<<80a51c4c74554a6b10f6ff0962f00bc0>>
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
    readonly completedAt: any | null | undefined;
    readonly degree: string;
    readonly institution: string;
    readonly startedAt: any;
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
          "name": "startedAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "completedAt",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "23d78ee18ab19c2a895ea9cda48742c7";

export default node;
