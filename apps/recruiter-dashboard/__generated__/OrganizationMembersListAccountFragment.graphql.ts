/**
 * @generated SignedSource<<4743f2229266912c984742ab970622c3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationMembersListAccountFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"MemberAccountFragment">;
  readonly " $fragmentType": "OrganizationMembersListAccountFragment";
};
export type OrganizationMembersListAccountFragment$key = {
  readonly " $data"?: OrganizationMembersListAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationMembersListAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationMembersListAccountFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MemberAccountFragment"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "7dd2bc0223bcc1b0c3cc036f313c7dfd";

export default node;
