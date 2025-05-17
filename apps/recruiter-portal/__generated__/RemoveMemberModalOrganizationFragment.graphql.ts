/**
 * @generated SignedSource<<c0dedb9ccf31ee5c67890cde9ed3addd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RemoveMemberModalOrganizationFragment$data = {
  readonly id: string;
  readonly " $fragmentType": "RemoveMemberModalOrganizationFragment";
};
export type RemoveMemberModalOrganizationFragment$key = {
  readonly " $data"?: RemoveMemberModalOrganizationFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RemoveMemberModalOrganizationFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RemoveMemberModalOrganizationFragment",
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

(node as any).hash = "c78a87556d9baad89d84f5c12c584b7e";

export default node;
