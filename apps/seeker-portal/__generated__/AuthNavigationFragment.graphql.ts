/**
 * @generated SignedSource<<540c8c1441f9f4ace1e65ed2969dfa22>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AuthNavigationFragment$data = {
  readonly __typename: "Account";
  readonly avatarUrl: string;
  readonly fullName: string;
  readonly profile: {
    readonly progressPercentage: number;
  };
  readonly " $fragmentType": "AuthNavigationFragment";
};
export type AuthNavigationFragment$key = {
  readonly " $data"?: AuthNavigationFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AuthNavigationFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AuthNavigationFragment",
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
      "kind": "ScalarField",
      "name": "fullName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "avatarUrl",
      "storageKey": null
    },
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
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "progressPercentage",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      "action": "THROW"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "43e3b7c83c487fc02a9975be2e345cdb";

export default node;
