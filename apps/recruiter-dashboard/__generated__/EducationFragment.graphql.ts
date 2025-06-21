/**
 * @generated SignedSource<<9c810f437ded678d9e0845c4f1c1cfc7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type EducationFragment$data = {
  readonly __typename: "ProfileSnapshot";
  readonly education: ReadonlyArray<{
    readonly completedAt: any | null | undefined;
    readonly degree: string;
    readonly institution: string;
    readonly startedAt: any;
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
  "type": "ProfileSnapshot",
  "abstractKey": null
};

(node as any).hash = "85b725772a2ff0c2666b4aa173dcd0af";

export default node;
