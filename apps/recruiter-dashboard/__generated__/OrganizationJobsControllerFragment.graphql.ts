/**
 * @generated SignedSource<<fbade74a4b880fd4dd7ce9f5088ee22e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationJobsControllerFragment$data = {
  readonly isAdmin: boolean;
  readonly " $fragmentType": "OrganizationJobsControllerFragment";
};
export type OrganizationJobsControllerFragment$key = {
  readonly " $data"?: OrganizationJobsControllerFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationJobsControllerFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationJobsControllerFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isAdmin",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "26176dcecc747a54d043d47e6216e61e";

export default node;
