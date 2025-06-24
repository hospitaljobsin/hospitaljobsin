/**
 * @generated SignedSource<<8e003a2f5a2826fd8baddbd0325a993d>>
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
    readonly issuer: string;
    readonly licenseNumber: string;
    readonly name: string;
    readonly registrationYear: number;
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
          "name": "registrationYear",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "73f1449d450af5309cd566d3f9868227";

export default node;
