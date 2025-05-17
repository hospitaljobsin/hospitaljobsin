/**
 * @generated SignedSource<<d093f5eae9c5f4191b836ca8bd885470>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PromoteMemberModalOrganizationFragment$data = {
  readonly id: string;
  readonly " $fragmentType": "PromoteMemberModalOrganizationFragment";
};
export type PromoteMemberModalOrganizationFragment$key = {
  readonly " $data"?: PromoteMemberModalOrganizationFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PromoteMemberModalOrganizationFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PromoteMemberModalOrganizationFragment",
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

(node as any).hash = "317daede994544c2be091868858ec80c";

export default node;
