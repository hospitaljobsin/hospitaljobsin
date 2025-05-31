/**
 * @generated SignedSource<<bc85bc54b3b029bf1c2428a80c3e11d9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type MemberFragment$data = {
  readonly createdAt: any;
  readonly node: {
    readonly avatarUrl: string;
    readonly fullName: string;
  };
  readonly role: string;
  readonly " $fragmentSpreads": FragmentRefs<"MemberControlsFragment">;
  readonly " $fragmentType": "MemberFragment";
};
export type MemberFragment$key = {
  readonly " $data"?: MemberFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MemberFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MemberFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "role",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Account",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
      "selections": [
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
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MemberControlsFragment"
    }
  ],
  "type": "OrganizationMemberEdge",
  "abstractKey": null
};

(node as any).hash = "ce03cce9432fc68bf2d0a1b86ba5fbc0";

export default node;
