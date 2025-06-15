/**
 * @generated SignedSource<<17cca957d13e0d45d7a82f1db5b01612>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import type { ReaderFragment } from 'relay-runtime';
import type { FragmentRefs } from "relay-runtime";
export type UpdateLocationPreferencesFormFragment$data = {
  readonly profile: {
    readonly locationsOpenToWork?: ReadonlyArray<string>;
    readonly openToRelocationAnywhere?: boolean;
  };
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "4220c4aba192180452936599079d397c";

export default node;
