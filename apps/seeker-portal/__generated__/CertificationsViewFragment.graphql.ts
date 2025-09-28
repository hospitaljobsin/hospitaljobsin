/**
 * @generated SignedSource<<6bad6ee3e56e535f13074d6e3a399ad1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type CertificationsViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "DesktopCertificationsViewFragment" | "MobileCertificationsViewFragment">;
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
    },
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

(node as any).hash = "d4a97c00ad2cdcbb55f7489db6871b75";

export default node;
