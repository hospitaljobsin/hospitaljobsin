/**
 * @generated SignedSource<<989ab035f3dd813c70151662aca4aa40>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type MemberOrganizationFragment$data = {
  readonly isAdmin: boolean;
  readonly " $fragmentSpreads": FragmentRefs<"MemberControlsOrganizationFragment">;
  readonly " $fragmentType": "MemberOrganizationFragment";
};
export type MemberOrganizationFragment$key = {
  readonly " $data"?: MemberOrganizationFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MemberOrganizationFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MemberOrganizationFragment",
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
      "name": "MemberControlsOrganizationFragment"
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "71d051753303365ac119b12c9a345b55";

export default node;
