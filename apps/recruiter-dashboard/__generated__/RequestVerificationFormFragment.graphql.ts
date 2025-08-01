/**
 * @generated SignedSource<<0bf63214690b59ed91ceb4a17b11ccfc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type RequestVerificationFormFragment$data = {
  readonly __typename: "Organization";
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
      "name": "__typename",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "f9ecbf05eeef270cab04a42888188bcc";

export default node;
