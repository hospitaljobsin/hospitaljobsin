/**
 * @generated SignedSource<<c08d39ddded75dff777d391d80114988>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
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
