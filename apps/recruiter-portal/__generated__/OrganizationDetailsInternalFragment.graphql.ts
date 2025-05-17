/**
 * @generated SignedSource<<7e89c226d381d3fe5e5199fc9f367cf1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrganizationDetailsInternalFragment$data = {
  readonly description: string | null | undefined;
  readonly email: string | null | undefined;
  readonly location: string | null | undefined;
  readonly logoUrl: string;
  readonly name: string;
  readonly website: string | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"OrganizationStatisticsFragment">;
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
      "args": null,
      "kind": "FragmentSpread",
      "name": "OrganizationStatisticsFragment"
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "b7c9a3fa18631c8cc0608f922e8d5040";

export default node;
