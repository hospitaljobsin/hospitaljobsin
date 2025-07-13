/**
 * @generated SignedSource<<ada1cfbd343c62605f0afe6eccc256a9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateLocationPreferencesFormFragment$data = {
  readonly address: string | null | undefined;
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "address",
      "storageKey": null
    }
  ],
  "type": "Profile",
  "abstractKey": null
};

(node as any).hash = "cbf79ca316aaf8b3f019bcc441d5a8d8";

export default node;
