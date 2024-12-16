/**
 * @generated SignedSource<<351fbf6f602062cbe343eb97179f5626>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AuthDropdownFragment$data = {
  readonly __typename: "Account";
  readonly email: string;
  readonly fullName: string;
  readonly " $fragmentType": "AuthDropdownFragment";
};
export type AuthDropdownFragment$key = {
  readonly " $data"?: AuthDropdownFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AuthDropdownFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AuthDropdownFragment",
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
      "kind": "ScalarField",
      "name": "fullName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "5c144dcdd8fb1e14b2165d4c9e3ca3be";

export default node;
