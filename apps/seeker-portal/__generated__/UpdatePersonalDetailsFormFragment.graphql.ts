/**
 * @generated SignedSource<<3cdf25d2d64ad021e6faa8f0f7a73237>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
export type GenderType = "FEMALE" | "MALE" | "OTHER" | "%future added value";
export type MaritalStatusType = "MARRIED" | "SINGLE" | "%future added value";
import type { FragmentRefs } from "relay-runtime";
export type UpdatePersonalDetailsFormFragment$data = {
  readonly address: string;
  readonly category: string | null | undefined;
  readonly contact: {
    readonly email: string;
    readonly phone: string;
  };
  readonly dateOfBirth: any | null | undefined;
  readonly gender: GenderType | null | undefined;
  readonly maritalStatus: MaritalStatusType | null | undefined;
  readonly " $fragmentType": "UpdatePersonalDetailsFormFragment";
};
export type UpdatePersonalDetailsFormFragment$key = {
  readonly " $data"?: UpdatePersonalDetailsFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdatePersonalDetailsFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdatePersonalDetailsFormFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Contact",
      "kind": "LinkedField",
      "name": "contact",
      "plural": false,
      "selections": [
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
          "name": "phone",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "address",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "gender",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dateOfBirth",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "maritalStatus",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "category",
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "98d06ad1c3c65079961dc0635dd94351";

export default node;
