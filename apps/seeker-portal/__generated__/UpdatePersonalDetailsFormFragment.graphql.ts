/**
 * @generated SignedSource<<17e25c830d3558bc2ffdb366c8c7ec41>>
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

(node as any).hash = "ee29dab765e5e6aef268e5f255d4a58b";

export default node;
