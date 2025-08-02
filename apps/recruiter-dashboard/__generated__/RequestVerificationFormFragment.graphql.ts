/**
 * @generated SignedSource<<ade82cc04848cd71921676515c9912ec>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type RequestVerificationFormFragment$data = {
  readonly description: string | null | undefined;
  readonly id: string;
  readonly logoUrl: string;
  readonly name: string;
  readonly " $fragmentType": "RequestVerificationFormFragment";
};
export type RequestVerificationFormFragment$key = {
  readonly " $data"?: RequestVerificationFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RequestVerificationFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RequestVerificationFormFragment",
  "selections": [
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "logoUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "8a180fad49d9730aa305425fe6654df4";

export default node;
