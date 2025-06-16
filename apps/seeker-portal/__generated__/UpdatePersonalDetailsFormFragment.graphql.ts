/**
 * @generated SignedSource<<fdf0813786fd126683b77562c3d5ee80>>
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

(node as any).hash = "0fef2ec2c8fcd288d1e28da5b4ed21d6";

export default node;
