/**
 * @generated SignedSource<<aa3bf1ca680e707caa30ddd17ad1cf37>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationsViewFragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DashboardHeaderFragment" | "OrganizationsGridFragment">;
  readonly " $fragmentType": "OrganizationsViewFragment";
};
export type OrganizationsViewFragment$key = {
  readonly " $data"?: OrganizationsViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationsViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationsViewFragment",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DashboardHeaderFragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "OrganizationsGridFragment"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "5855621abebaca633f3c3dfe4ef1e024";

export default node;
