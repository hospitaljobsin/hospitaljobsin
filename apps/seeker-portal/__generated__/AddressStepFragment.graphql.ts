/**
 * @generated SignedSource<<2c7fc629cfc9c5cbdd51cda3a8fce803>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AddressStepFragment$data = {
  readonly profile: {
    readonly address: string | null | undefined;
  };
  readonly " $fragmentType": "AddressStepFragment";
};
export type AddressStepFragment$key = {
  readonly " $data"?: AddressStepFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AddressStepFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AddressStepFragment",
  "selections": [
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "concreteType": "Profile",
        "kind": "LinkedField",
        "name": "profile",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "address",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      "action": "THROW"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "72dc6af11dfe98cb8975edd982f8ec26";

export default node;
