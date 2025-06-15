/**
 * @generated SignedSource<<3ff45f0d2edf715e00f626e0aaa255cf>>
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
export type PersonalDetailsFragment$data = {
  readonly address: string;
  readonly category: string | null | undefined;
  readonly dateOfBirth: any | null | undefined;
  readonly gender: GenderType | null | undefined;
  readonly maritalStatus: MaritalStatusType | null | undefined;
  readonly " $fragmentType": "PersonalDetailsFragment";
};
export type PersonalDetailsFragment$key = {
  readonly " $data"?: PersonalDetailsFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"PersonalDetailsFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PersonalDetailsFragment",
  "selections": [
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

(node as any).hash = "e9ebaf3c4fe8a45f26cace7acd44fdb0";

export default node;
