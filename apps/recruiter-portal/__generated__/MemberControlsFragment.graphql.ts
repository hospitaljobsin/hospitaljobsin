/**
 * @generated SignedSource<<a9e6528662b86f52089f2c43d2f1e194>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MemberControlsFragment$data = {
  readonly node: {
    readonly fullName: string;
  };
  readonly role: string;
  readonly " $fragmentSpreads": FragmentRefs<"DemoteMemberModalFragment" | "PromoteMemberModalFragment" | "RemoveMemberModalFragment">;
  readonly " $fragmentType": "MemberControlsFragment";
};
export type MemberControlsFragment$key = {
  readonly " $data"?: MemberControlsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MemberControlsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MemberControlsFragment",
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
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "RemoveMemberModalFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DemoteMemberModalFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PromoteMemberModalFragment"
    }
  ],
  "type": "OrganizationMemberEdge",
  "abstractKey": null
};

(node as any).hash = "a8d30d2697d21274d16f18cd1cc9f823";

export default node;
