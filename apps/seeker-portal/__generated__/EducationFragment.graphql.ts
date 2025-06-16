/**
 * @generated SignedSource<<9f065d9803af974bbee5bb8d21e1c2bf>>
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
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "b37e0758a470133a1ec8a8d53a3038d0";

export default node;
