/**
 * @generated SignedSource<<80d2913572e0075d29f82d3b58a50386>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type MobileIntroductionViewFragment$data = {
  readonly viewer: {
    readonly __typename: "Account";
    readonly profile: {
      readonly " $fragmentSpreads": FragmentRefs<"UpdateIntroductionFormFragment">;
    };
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  };
  readonly " $fragmentType": "MobileIntroductionViewFragment";
};
export type MobileIntroductionViewFragment$key = {
  readonly " $data"?: MobileIntroductionViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MobileIntroductionViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MobileIntroductionViewFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "viewer",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__typename",
          "storageKey": null
        },
        {
          "kind": "InlineFragment",
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
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "UpdateIntroductionFormFragment"
                  }
                ],
                "storageKey": null
              },
              "action": "THROW"
            }
          ],
          "type": "Account",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "84f0dfafdf4110bb386badd748d84a4f";

export default node;
