/**
 * @generated SignedSource<<64420b1a9fbcedcb4ceb130fd6af2029>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DemoteMemberModalOrganizationFragment$data = {
  readonly id: string;
  readonly " $fragmentType": "DemoteMemberModalOrganizationFragment";
};
export type DemoteMemberModalOrganizationFragment$key = {
  readonly " $data"?: DemoteMemberModalOrganizationFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DemoteMemberModalOrganizationFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DemoteMemberModalOrganizationFragment",
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

(node as any).hash = "93a27392597304d4e8f5cfd7382abd9c";

export default node;
