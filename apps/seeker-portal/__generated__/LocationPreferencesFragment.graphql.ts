/**
 * @generated SignedSource<<47e4668b7514754dd5e91bee1b284def>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LocationPreferencesFragment$data = {
  readonly address: string | null | undefined;
  readonly locationsOpenToWork: ReadonlyArray<string>;
  readonly openToRelocationAnywhere: boolean;
  readonly " $fragmentType": "LocationPreferencesFragment";
};
export type LocationPreferencesFragment$key = {
  readonly " $data"?: LocationPreferencesFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LocationPreferencesFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LocationPreferencesFragment",
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

(node as any).hash = "28d1ee7d07728090e5fc16b4d95f01c1";

export default node;
