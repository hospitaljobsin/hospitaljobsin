/**
 * @generated SignedSource<<5ff0c6a8af0196707c7c42a85578f9d7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type InviteStatus = "ACCEPTED" | "DECLINED" | "PENDING" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type InviteFragment$data = {
  readonly createdAt: any;
  readonly createdBy: {
    readonly avatarUrl: string;
    readonly fullName: string;
  };
  readonly email: string;
  readonly expiresAt: any | null | undefined;
  readonly status: InviteStatus;
  readonly " $fragmentSpreads": FragmentRefs<"DeleteInviteModalFragment">;
  readonly " $fragmentType": "InviteFragment";
};
export type InviteFragment$key = {
  readonly " $data"?: InviteFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"InviteFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "InviteFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "expiresAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Account",
      "kind": "LinkedField",
      "name": "createdBy",
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DeleteInviteModalFragment"
    }
  ],
  "type": "OrganizationInvite",
  "abstractKey": null
};

(node as any).hash = "890ce4f3ce1aa7b91eb48a353aa87492";

export default node;
