/**
 * @generated SignedSource<<92bc5bed9f70237caed5a0b400f75df2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type RejectedVerificationViewFragment$data = {
  readonly __typename: "Organization";
  readonly id: string;
  readonly name: string;
  readonly " $fragmentSpreads": FragmentRefs<"RequestVerificationFormFragment">;
  readonly " $fragmentType": "RejectedVerificationViewFragment";
};
export type RejectedVerificationViewFragment$key = {
  readonly " $data"?: RejectedVerificationViewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RejectedVerificationViewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RejectedVerificationViewFragment",
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
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "RequestVerificationFormFragment"
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "45a43b04f0b8f5d73a180c825c93328f";

export default node;
