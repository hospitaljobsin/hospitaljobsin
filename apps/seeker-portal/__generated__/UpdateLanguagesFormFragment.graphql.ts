/**
 * @generated SignedSource<<07a09ad2f7ed879ff36e79c07b79c622>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateLanguagesFormFragment$data = {
  readonly __typename: "Profile";
  readonly languages: ReadonlyArray<{
    readonly name: string;
    readonly proficiency: string;
  }>;
  readonly " $fragmentType": "UpdateLanguagesFormFragment";
};
export type UpdateLanguagesFormFragment$key = {
  readonly " $data"?: UpdateLanguagesFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateLanguagesFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateLanguagesFormFragment",
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
      "concreteType": "Language",
      "kind": "LinkedField",
      "name": "languages",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "proficiency",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "a0a8e5bb9b8e8127d1c5dbf4a8a73523";

export default node;
