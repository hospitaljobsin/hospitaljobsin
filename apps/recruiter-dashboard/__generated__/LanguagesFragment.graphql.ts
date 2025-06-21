/**
 * @generated SignedSource<<4eedf122a6f4da98d7ed8bc8cee49894>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LanguagesFragment$data = {
  readonly __typename: "ProfileSnapshot";
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
  "type": "ProfileSnapshot",
  "abstractKey": null
};

(node as any).hash = "c507d7bca8f8629cfd950ff7a7e1957b";

export default node;
