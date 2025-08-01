/**
 * @generated SignedSource<<737bd5789f68afad50e06adee3af0d3f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type OrganizationDetailsInternalFragment$data = {
  readonly description: string | null | undefined;
  readonly email: string | null | undefined;
  readonly location: string | null | undefined;
  readonly logoUrl: string;
  readonly name: string;
  readonly verifiedAt: any | null | undefined;
  readonly website: string | null | undefined;
  readonly " $fragmentType": "OrganizationDetailsInternalFragment";
};
export type OrganizationDetailsInternalFragment$key = {
  readonly " $data"?: OrganizationDetailsInternalFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationDetailsInternalFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrganizationDetailsInternalFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "logoUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "website",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "location",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "verifiedAt",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "64746e02345c386732b47e5caa79dda3";

export default node;
