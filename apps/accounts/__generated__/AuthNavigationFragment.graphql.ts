/**
 * @generated SignedSource<<9d83d87616d79903cfae9787d961e488>>
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
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 120
        }
      ],
      "kind": "ScalarField",
      "name": "avatarUrl",
      "storageKey": "avatarUrl(size:120)"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "c8ebf3bae2aebceb4e86dd14b143803f";

export default node;
