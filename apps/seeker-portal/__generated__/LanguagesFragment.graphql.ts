/**
 * @generated SignedSource<<484f3c10db46418a6afcf98d0465a591>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LanguagesFragment$data = {
  readonly __typename: "Profile";
  readonly languages: ReadonlyArray<{
    readonly name: string;
    readonly proficiency: string;
  }>;
  readonly " $fragmentType": "LanguagesFragment";
};
export type LanguagesFragment$key = {
  readonly " $data"?: LanguagesFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LanguagesFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LanguagesFragment",
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

(node as any).hash = "fd31fea74a659a4a01fb69c01b0b98cd";

export default node;
