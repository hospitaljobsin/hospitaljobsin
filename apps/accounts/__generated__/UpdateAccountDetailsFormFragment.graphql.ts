/**
 * @generated SignedSource<<e29dbb1a0e739fb79e4a82b7ded3aae0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
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
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 120
        }
      ],
      "kind": "ScalarField",
      "name": "avatarUrl",
      "storageKey": "avatarUrl(size:120)"
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "aa5879c7e97c58c3b463a11d91f420d0";

export default node;
