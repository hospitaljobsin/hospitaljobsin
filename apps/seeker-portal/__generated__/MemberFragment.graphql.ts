/**
 * @generated SignedSource<<7ffc2391b5455e6758bfe3510dfad33a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type OrganizationMemberRole = "ADMIN" | "MEMBER" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type MemberFragment$data = {
  readonly node: {
    readonly avatarUrl: string;
    readonly fullName: string;
  };
  readonly role: OrganizationMemberRole;
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
    }
  ],
  "type": "OrganizationMemberEdge",
  "abstractKey": null
};

(node as any).hash = "65c89f5777542a5356b3fdf2cb7bc83d";

export default node;
