/**
 * @generated SignedSource<<cb379dfe68db4954f505958914b6e97f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type LocationPreferencesFragment$data = {
  readonly profile: {
    readonly __typename: "ProfileNotFoundError";
    readonly locationsOpenToWork?: ReadonlyArray<string>;
    readonly openToRelocationAnywhere?: boolean;
  };
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
      "concreteType": null,
      "kind": "LinkedField",
      "name": "profile",
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
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
        },
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "__typename",
              "storageKey": null
            }
          ],
          "type": "ProfileNotFoundError",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "ac3df8d2adef336aeb48ad266ee8dd59";

export default node;
