/**
 * @generated SignedSource<<2b6aa9d505cc8e5db3475102ee532377>>
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
    readonly issuer: string;
    readonly licenseNumber: string;
    readonly name: string;
    readonly registrationYear: number;
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
          "name": "registrationYear",
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "e3ba46900300b23734351d4261040d06";

export default node;
