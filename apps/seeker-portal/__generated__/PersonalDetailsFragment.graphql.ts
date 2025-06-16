/**
 * @generated SignedSource<<4121865bb0a865065f536d2a95555b18>>
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

(node as any).hash = "77c8f1c2fd08e93312e191ce4552d931";

export default node;
