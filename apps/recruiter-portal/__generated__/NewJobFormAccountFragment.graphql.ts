/**
 * @generated SignedSource<<b4c102a173aae51d3e2c2be19066c064>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type NewJobFormAccountFragment$data = {
  readonly __typename: "Account";
  readonly avatarUrl: string;
  readonly fullName: string;
  readonly " $fragmentType": "NewJobFormAccountFragment";
};
export type NewJobFormAccountFragment$key = {
  readonly " $data"?: NewJobFormAccountFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"NewJobFormAccountFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "NewJobFormAccountFragment",
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
      "name": "avatarUrl",
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "0b0c99dffc397ac4bce766b16e83433d";

export default node;
