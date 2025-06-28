/**
 * @generated SignedSource<<e33a2149918f96fd60d6398b7fbeabc0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationInvitesControllerFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"InviteMemberModalFragment">;
  readonly " $fragmentType": "OrganizationInvitesControllerFragment";
};
export type OrganizationInvitesControllerFragment$key = {
  readonly " $data"?: OrganizationInvitesControllerFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationInvitesControllerFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationInvitesControllerFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "InviteMemberModalFragment"
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "daab594e2fe11d65d49d9f0eddd92a1b";

export default node;
