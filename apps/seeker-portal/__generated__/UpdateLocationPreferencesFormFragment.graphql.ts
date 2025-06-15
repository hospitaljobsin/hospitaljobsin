/**
 * @generated SignedSource<<baeb0bf2d841d5cdfa7ba4d8204c4cf5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateLocationPreferencesFormFragment$data = {
  readonly locationsOpenToWork: ReadonlyArray<string>;
  readonly openToRelocationAnywhere: boolean;
  readonly " $fragmentType": "UpdateLocationPreferencesFormFragment";
};
export type UpdateLocationPreferencesFormFragment$key = {
  readonly " $data"?: UpdateLocationPreferencesFormFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateLocationPreferencesFormFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateLocationPreferencesFormFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "locationsOpenToWork",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "openToRelocationAnywhere",
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "40f047ff56876ff0a4ba85243a625d8b";

export default node;
