/**
 * @generated SignedSource<<f89171e5ed4761ff9e28f3082b5e2a55>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateAccountDetailsFormFragment$data = {
  readonly avatarUrl: string;
  readonly email: string;
  readonly fullName: string;
  readonly " $fragmentType": "UpdateAccountDetailsFormFragment";
};
export type UpdateAccountDetailsFormFragment$key = {
  readonly " $data"?: UpdateAccountDetailsFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateAccountDetailsFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateAccountDetailsFormFragment",
  "selections": [
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "avatarUrl",
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "ca653b65119be5fa44680b7fb2ba7d64";

export default node;
