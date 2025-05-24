/**
 * @generated SignedSource<<a1b3b70c3d3f550573ea94214767d645>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LanguagesFragment$data = {
  readonly profile: {
    readonly __typename: "Profile";
    readonly languages: ReadonlyArray<{
      readonly name: string;
      readonly proficiency: string;
    }>;
  } | {
    readonly __typename: "ProfileNotFoundError";
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "LanguagesFragment";
};
export type LanguagesFragment$key = {
  readonly " $data"?: LanguagesFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LanguagesFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LanguagesFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "profile",
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/),
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
        },
        {
          "kind": "InlineFragment",
          "selections": [
            (v0/*: any*/)
          ],
          "type": "ProfileNotFoundError",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};
})();

(node as any).hash = "fa5e2159bf4a187486301865970b81d8";

export default node;
