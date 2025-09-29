/**
 * @generated SignedSource<<d3d923db07261482acefdd5514413e0e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type CertificationsViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DesktopCertificationsViewFragment" | "MobileCertificationsViewFragment">;
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
      "name": "DesktopCertificationsViewFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MobileCertificationsViewFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "5ecf08e7397093d4f9f9ebc1e912d983";

export default node;
