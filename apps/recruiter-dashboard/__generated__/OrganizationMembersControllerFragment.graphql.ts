/**
 * @generated SignedSource<<408f5466463b90e68fafb408ff26ab58>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationMembersControllerFragment$data = {
  readonly isAdmin: boolean;
  readonly " $fragmentSpreads": FragmentRefs<"InviteMemberModalFragment">;
  readonly " $fragmentType": "OrganizationMembersControllerFragment";
};
export type OrganizationMembersControllerFragment$key = {
  readonly " $data"?: OrganizationMembersControllerFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationMembersControllerFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationMembersControllerFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isAdmin",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "InviteMemberModalFragment"
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "5963d16425f91ab1ffe3f4f8152b7602";

export default node;
