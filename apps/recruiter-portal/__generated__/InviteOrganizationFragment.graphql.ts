/**
 * @generated SignedSource<<9dbf19b3d055916e3d1c9e14fe10e6c7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type InviteOrganizationFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DeleteInviteModalOrganizationFragment">;
  readonly " $fragmentType": "InviteOrganizationFragment";
};
export type InviteOrganizationFragment$key = {
  readonly " $data"?: InviteOrganizationFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"InviteOrganizationFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "InviteOrganizationFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DeleteInviteModalOrganizationFragment"
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "0195e452b80ea1812c06a6016450d8f7";

export default node;
