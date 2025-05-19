/**
 * @generated SignedSource<<2199e557fd5523236dd516a00f0762e3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type MemberControlsOrganizationFragment$data = {
  readonly adminCount: number;
  readonly " $fragmentSpreads": FragmentRefs<"DemoteMemberModalOrganizationFragment" | "PromoteMemberModalOrganizationFragment" | "RemoveMemberModalOrganizationFragment">;
  readonly " $fragmentType": "MemberControlsOrganizationFragment";
};
export type MemberControlsOrganizationFragment$key = {
  readonly " $data"?: MemberControlsOrganizationFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MemberControlsOrganizationFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MemberControlsOrganizationFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "RemoveMemberModalOrganizationFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DemoteMemberModalOrganizationFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PromoteMemberModalOrganizationFragment"
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "adminCount",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "fa72204c6dd01f2f2fda9cd45282e8af";

export default node;
