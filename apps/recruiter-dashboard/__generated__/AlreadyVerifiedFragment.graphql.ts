/**
 * @generated SignedSource<<bdbb94d2c48786a125f7f40c4b4f18c0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type AlreadyVerifiedFragment$data = {
  readonly __typename: "Organization";
  readonly verifiedAt: any | null | undefined;
  readonly " $fragmentType": "AlreadyVerifiedFragment";
};
export type AlreadyVerifiedFragment$key = {
  readonly " $data"?: AlreadyVerifiedFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"AlreadyVerifiedFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AlreadyVerifiedFragment",
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
      "name": "verifiedAt",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "cb31f37c9ae73319ba57c3c643b3797e";

export default node;
