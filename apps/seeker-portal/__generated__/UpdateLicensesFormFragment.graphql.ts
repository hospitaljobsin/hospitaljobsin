/**
 * @generated SignedSource<<d2347d8282c8eaa0fd7c128f5864e0b2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateLicensesFormFragment$data = {
  readonly __typename: "Profile";
  readonly licenses: ReadonlyArray<{
    readonly expiresAt: any | null | undefined;
    readonly issuedAt: any;
    readonly issuer: string;
    readonly licenseNumber: string;
    readonly name: string;
  }>;
  readonly " $fragmentType": "UpdateLicensesFormFragment";
};
export type UpdateLicensesFormFragment$key = {
  readonly " $data"?: UpdateLicensesFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateLicensesFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateLicensesFormFragment",
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
      "concreteType": "License",
      "kind": "LinkedField",
      "name": "licenses",
      "plural": true,
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
          "name": "issuer",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "licenseNumber",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "issuedAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "expiresAt",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "ac8f5a4bea15ffc72831fb3081150417";

export default node;
