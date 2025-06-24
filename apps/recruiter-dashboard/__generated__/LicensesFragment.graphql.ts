/**
 * @generated SignedSource<<07724baf0f801cd3a326d612f042e505>>
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
  readonly __typename: "ProfileSnapshot";
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
  "type": "ProfileSnapshot",
  "abstractKey": null
};

(node as any).hash = "8971a3a3ac373fdb2aeeb5dde30e09d3";

export default node;
