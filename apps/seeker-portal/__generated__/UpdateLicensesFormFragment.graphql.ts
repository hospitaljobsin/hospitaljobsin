/**
 * @generated SignedSource<<484dde5bb94baa825ffc5eb335869b2d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type LicenseVerificationStatus = "PENDING" | "REJECTED" | "VERIFIED" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type UpdateLicensesFormFragment$data = {
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

(node as any).hash = "d9a39502c7a8737369fa478bc7f98d94";

export default node;
