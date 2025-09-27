/**
 * @generated SignedSource<<52d299e6e2dbcc5f5b9abd609218ffb9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type CertificationsViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment">;
  readonly " $fragmentType": "CertificationsViewFragment";
};
export type CertificationsViewFragment$key = {
  readonly " $data"?: CertificationsViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"CertificationsViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CertificationsViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DashboardHeaderFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "cc88fcdb7ca71976c5a799ac6c67ba19";

export default node;
