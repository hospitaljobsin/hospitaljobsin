/**
 * @generated SignedSource<<f36cba217c578cf6500c7b7c4a0c6e96>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type CertificationsViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "DesktopCertificationsViewFragment" | "MobileCertificationsViewFragment" | "ResumeProgressFragment">;
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
      "name": "ResumeProgressFragment"
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

(node as any).hash = "024dd98a60539cbbadfa27369f1011e8";

export default node;
