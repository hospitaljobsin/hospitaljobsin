/**
 * @generated SignedSource<<947ab15f3d635ba869346df16b74448d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type JobCreationFormFragment$data = {
  readonly id: string;
  readonly " $fragmentType": "JobCreationFormFragment";
};
export type JobCreationFormFragment$key = {
  readonly " $data"?: JobCreationFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"JobCreationFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "JobCreationFormFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};

(node as any).hash = "7d093739763523683a8bfdca90eea106";

export default node;
