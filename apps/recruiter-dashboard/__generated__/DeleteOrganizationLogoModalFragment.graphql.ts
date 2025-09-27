/**
 * @generated SignedSource<<36269d817c0801d96dd6f352fed7e72f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type DeleteOrganizationLogoModalFragment$data = {
  readonly id: string;
  readonly " $fragmentType": "DeleteOrganizationLogoModalFragment";
};
export type DeleteOrganizationLogoModalFragment$key = {
  readonly " $data"?: DeleteOrganizationLogoModalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DeleteOrganizationLogoModalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DeleteOrganizationLogoModalFragment",
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

(node as any).hash = "d2e3a516c514d2f22e7ca90d91888169";

export default node;
