/**
 * @generated SignedSource<<8d63f5917ec83933b834ca2e7dc781c1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type LicenseVerificationStatus = "PENDING" | "REJECTED" | "VERIFIED" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type LicensesFragment$data = {
  readonly __typename: "Profile";
  readonly licenses: ReadonlyArray<{
    readonly expiresAt: any;
    readonly issuedAt: any;
    readonly issuer: string;
    readonly licenseNumber: string;
    readonly name: string;
    readonly verificationNotes: string | null | undefined;
    readonly verificationStatus: LicenseVerificationStatus;
    readonly verifiedAt: any | null | undefined;
  }>;
  readonly " $fragmentType": "LicensesFragment";
};
export type LicensesFragment$key = {
  readonly " $data"?: LicensesFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LicensesFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LicensesFragment",
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
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "verificationStatus",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "verifiedAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "verificationNotes",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "98e1a35834e277efac7f85c65c065619";

export default node;
