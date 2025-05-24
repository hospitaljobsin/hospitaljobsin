/**
 * @generated SignedSource<<eb82248c7898fb5c27dcb6b5d0ea3356>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type CancelNewJobModalOrganizationFragment$data = {
  readonly __typename: "Organization";
  readonly slug: string;
  readonly " $fragmentType": "CancelNewJobModalOrganizationFragment";
};
export type CancelNewJobModalOrganizationFragment$key = {
  readonly " $data"?: CancelNewJobModalOrganizationFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"CancelNewJobModalOrganizationFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CancelNewJobModalOrganizationFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "bf46e3ebff9e82b97fa88183a86a21e4";

export default node;
