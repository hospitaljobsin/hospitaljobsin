/**
 * @generated SignedSource<<bdae730ef87a00d3989707c7c7ba4582>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type InviteMemberModalFragment$data = {
  readonly id: string;
  readonly " $fragmentType": "InviteMemberModalFragment";
};
export type InviteMemberModalFragment$key = {
  readonly " $data"?: InviteMemberModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"InviteMemberModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "InviteMemberModalFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "3aba4ae71f3aabf51d90f3c300787778";

export default node;
