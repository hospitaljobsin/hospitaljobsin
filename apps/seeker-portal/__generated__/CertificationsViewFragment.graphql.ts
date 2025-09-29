/**
 * @generated SignedSource<<b94d294b7cff2b257567f9fd0c3d3ff7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type CertificationsViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DesktopCertificationsViewFragment" | "MobileCertificationsViewFragment" | "ResumeProgressFragment">;
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

(node as any).hash = "deb498b02d19697507b9b99e64063643";

export default node;
