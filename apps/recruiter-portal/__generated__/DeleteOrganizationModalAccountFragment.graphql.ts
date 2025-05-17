/**
 * @generated SignedSource<<2022e196be53868d6a16c8084eefa3ca>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DeleteOrganizationModalAccountFragment$data = {
  readonly id: string;
  readonly " $fragmentType": "DeleteOrganizationModalAccountFragment";
};
export type DeleteOrganizationModalAccountFragment$key = {
  readonly " $data"?: DeleteOrganizationModalAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DeleteOrganizationModalAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DeleteOrganizationModalAccountFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "494b7520ee3d5836cc70865f73dc185b";

export default node;
