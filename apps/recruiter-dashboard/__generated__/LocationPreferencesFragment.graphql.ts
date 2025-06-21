/**
 * @generated SignedSource<<b2976023964289830c1fac2f2f0a45b0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LocationPreferencesFragment$data = {
  readonly address: string;
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
  "type": "ProfileSnapshot",
  "abstractKey": null
};

(node as any).hash = "e9b10bcd901beb1f2819041afb551b7a";

export default node;
